# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.sudo
    pkgs.sudo-rs
    pkgs.sudo-font
    pkgs.python3
    pkgs.python3Packages.pip
    pkgs.python3Packages.langchain
    
    # pkgs.nodejs_20
    # pkgs.python3
    # pkgs.python3Packages.pip
    # pkgs.python3Packages.venv
    # pkgs.python3Packages.langchain
    # pkgs.python3Packages.langchain-core
    # pkgs.python3Packages.langchain-community
    # pkgs.python3Packages.langchain-google-genai
    # pkgs.python3Packages.langgraph
    # pkgs.python3Packages.polygon-api-wrapper

  ];
  # Sets environment variables in the workspace
  env = {
    VENV_DIR = ".venv";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "ms-python.debugpy"
      "ms-python.python"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        # create a python virtual environment
        create-venv = ''
          python -m venv $VENV_DIR

          if [ ! -f requirements.txt ]; then
            echo "requirements.txt not found. Creating one with flet..."
            echo "flet" > requirements.txt
          fi

          # activate virtual env and install requirements
          source $VENV_DIR/bin/activate
          pip install -r requirements.txt
        '';
        npm-install = "npm ci --no-audit --prefer-offline --no-progress --timing";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [ "src/App.tsx" "src/App.ts" "src/App.jsx" "src/App.js" ];
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
