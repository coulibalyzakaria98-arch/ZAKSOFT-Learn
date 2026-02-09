{ pkgs, config, ... }: {
  # Using a stable channel for Nix packages
  channel = "stable-23.11";

  # Packages required for the development environment
  packages = [
    # Upgraded to Node.js 22 to meet Vite's requirement (20.19+)
    pkgs.nodejs_22
    pkgs.nodePackages.npm
    pkgs.firebase-tools
    pkgs.nodePackages.concurrently
  ];

  # Environment variables available in the workspace
  env = {
    PORT = "3000";       # Port for the frontend preview
    BACKEND_PORT = "3001"; # Port for the backend service
  };

  idx = {
    # VS Code extensions to install
    extensions = [
      "dsznajder.es7-react-js-snippets"
      "bradlc.vscode-tailwindcss"
      "esbenp.prettier-vscode"
    ];

    workspace = {
      # Command to run when the workspace is created
      onCreate = {
        # The "install" script in the root package.json already handles installing
        # dependencies for both frontend and backend.
        install-dependencies = "npm run install";
      };

      # onStart is removed to prevent port conflicts with the `previews` section,
      # which is the modern way to manage development servers in IDX.
    };

    # Configuration for the development previews
    previews = {
      enable = true;
      previews = {
        # Preview for the frontend application
        web = {
          command = ["npm" "run" "start:frontend" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
          env = {
            # This dynamically constructs the backend URL for the frontend.
            # It uses the backend port and the unique workspace hostname.
            VITE_API_URL = "https://${config.env.BACKEND_PORT}-${config.idx.host.name}.idx.dev/api";
          };
        };

        # Preview for the backend service
        backend = {
          command = ["npm" "run" "start:backend"];
          manager = "web";
        };
      };
    };
  };
}
