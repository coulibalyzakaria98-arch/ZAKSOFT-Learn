const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

/**
 * Saves a user's note for a specific chapter.
 */
exports.saveNote = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to save a note.");
  }

  const { chapterId, content } = request.data;
  const userId = request.auth.uid;

  if (!chapterId || !content) {
    throw new HttpsError("invalid-argument", "The function must be called with 'chapterId' and 'content'.");
  }

  try {
    const noteRef = await db.collection("notes").add({
      userId: userId,
      chapterId: chapterId,
      content: content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, noteId: noteRef.id };
  } catch (error) {
    console.error("Error saving note:", error);
    throw new HttpsError("internal", "An error occurred while saving the note.");
  }
});

/**
 * Generates a PDF certificate for a completed formation.
 */
exports.generateCertificate = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to get a certificate.");
  }
  const userId = request.auth.uid;
  const userName = request.auth.token.name || 'Etudiant';

  const { formationId } = request.data;
  if (!formationId) {
    throw new HttpsError("invalid-argument", "The function must be called with 'formationId'.");
  }

  try {
    const formationRef = db.collection('formations').doc(formationId);
    const chaptersRef = formationRef.collection('chapitres');
    const userProgressRef = db.collection('users').doc(userId);

    const [formationSnap, chaptersSnap, userProgressSnap] = await Promise.all([
      formationRef.get(),
      chaptersRef.get(),
      userProgressRef.get()
    ]);

    if (!formationSnap.exists) {
      throw new HttpsError("not-found", "This formation does not exist.");
    }
    const formationData = formationSnap.data();
    const totalChapters = chaptersSnap.size;

    const userProgress = userProgressSnap.exists() ? userProgressSnap.data().progress || {} : {};
    const completedChapters = Object.values(userProgress[formationId] || {}).filter(c => c.completed).length;

    if (completedChapters < totalChapters || totalChapters === 0) {
        throw new HttpsError("failed-precondition", "You have not completed this formation yet.");
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText('Certificat de Réussite', {
      x: 50,
      y: height - 100,
      font: boldFont,
      size: 40,
      color: rgb(0.1, 0.1, 0.4),
    });

     page.drawText('Délivré à :', {
      x: 50,
      y: height - 200,
      font,
      size: 20,
    });

    page.drawText(userName, {
      x: 50,
      y: height - 250,
      font: boldFont,
      size: 30,
      color: rgb(0, 0, 0),
    });
    
     page.drawText('Pour avoir complété avec succès la formation :', {
      x: 50,
      y: height - 350,
      font,
      size: 20,
    });

    page.drawText(formationData.title, {
      x: 50,
      y: height - 400,
      font: boldFont,
      size: 30,
      color: rgb(0.1, 0.1, 0.4),
    });

    const today = new Date().toLocaleDateString('fr-FR');
    page.drawText(`Le ${today}`, {
      x: 50,
      y: height - 500,
      font,
      size: 15,
    });
    
    page.drawText('Zakaria - CEO de Zakaria-Soft', {
      x: 50,
      y: height - 600,
      font: boldFont,
      size: 20
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    return { pdfBase64 };

  } catch (error) {
    console.error("Error generating certificate:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "An error occurred while generating the certificate.");
  }
});

/**
 * Fetches the list of available formations.
 */
exports.getFormations = onCall(async (request) => {
  try {
    const formationsCollection = await db.collection("formations").get();
    const formations = formationsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return formations;
  } catch (error) {
    console.error("Error fetching formations:", error);
    throw new HttpsError("internal", "An error occurred while fetching the formations.");
  }
});

/**
 * Fetches the details of a specific formation, including its chapters.
 */
exports.getFormationDetails = onCall(async (request) => {
  const { formationId } = request.data;

  if (!formationId) {
    throw new HttpsError("invalid-argument", "The function must be called with 'formationId'.");
  }

  try {
    const formationRef = db.collection("formations").doc(formationId);
    const formationSnap = await formationRef.get();

    if (!formationSnap.exists) {
      throw new HttpsError("not-found", "Formation not found.");
    }

    const formation = { id: formationSnap.id, ...formationSnap.data() };

    const chaptersRef = formationRef.collection("chapitres");
    const chaptersSnap = await chaptersRef.orderBy("order").get();
    const chapters = chaptersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return { ...formation, chapters };
  } catch (error) {
    console.error("Error fetching formation details:", error);
    throw new HttpsError("internal", "An error occurred while fetching the formation details.");
  }
});


/**
 * Fetches the details of a specific chapter, including its content.
 */
exports.getChapterDetails = onCall(async (request) => {
  const { formationId, chapterId } = request.data;

  if (!formationId || !chapterId) {
    throw new HttpsError("invalid-argument", "The function must be called with 'formationId' and 'chapterId'.");
  }

  try {
    const chapterRef = db.collection("formations").doc(formationId).collection("chapitres").doc(chapterId);
    const chapterSnap = await chapterRef.get();

    if (!chapterSnap.exists) {
      throw new HttpsError("not-found", "Chapter not found.");
    }

    return { id: chapterSnap.id, ...chapterSnap.data() };
  } catch (error) {
    console.error("Error fetching chapter details:", error);
    throw new HttpsError("internal", "An error occurred while fetching the chapter details.");
  }
});

/**
 * Updates a user's progress for a specific chapter.
 */
exports.updateUserProgress = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in to update your progress.");
  }

  const { formationId, chapterId, completed } = request.data;
  const userId = request.auth.uid;

  if (!formationId || !chapterId || completed === undefined) {
    throw new HttpsError("invalid-argument", "The function must be called with 'formationId', 'chapterId', and 'completed'.");
  }

  try {
    const userProgressRef = db.collection("users").doc(userId);
    const progressUpdate = {};
    progressUpdate[`progress.${formationId}.${chapterId}.completed`] = completed;
    if (completed) {
      progressUpdate[`progress.${formationId}.${chapterId}.completedAt`] = new Date();
    }

    await userProgressRef.set(progressUpdate, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw new HttpsError("internal", "An error occurred while updating user progress.");
  }
});
