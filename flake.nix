{
  description = "urandom.io - /dev/urandom for humans";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{ flake-parts, self, ... }:
    let
      packageJson = builtins.fromJSON (builtins.readFile ./package.json);
      version = self.lastModifiedDate or "dev";
    in
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        inputs.treefmt-nix.flakeModule
      ];

      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      perSystem =
        {
          config,
          pkgs,
          lib,
          system,
          ...
        }:
        let
          # `dev` — bring the project up from a clean checkout to a hot-reloading
          # Astro dev server bound to every interface on port 4321, so LAN devices
          # and ngrok-style tunnels can reach it. Any extra args are forwarded to
          # `astro dev` (so e.g. `dev --port 1337` works).
          devScript = pkgs.writeShellScriptBin "dev" ''
            set -euo pipefail
            if [ ! -d node_modules ]; then
              echo "→ installing dependencies (bun install)..."
              ${pkgs.bun}/bin/bun install
            fi
            echo "→ starting Astro dev server with HMR on 0.0.0.0:4321..."
            exec ${pkgs.bun}/bin/bun run dev -- --host 0.0.0.0 "$@"
          '';

          devPackages = with pkgs; [
            bun
            nodejs_22
            git
            config.treefmt.build.wrapper
            devScript
          ];
        in
        {
          treefmt = {
            projectRootFile = "flake.nix";
            flakeCheck = false;
            programs = {
              nixfmt.enable = true;
              prettier = {
                enable = true;
                includes = [
                  "*.js"
                  "*.ts"
                  "*.tsx"
                  "*.json"
                  "*.css"
                  "*.astro"
                  "*.md"
                ];
                excludes = [
                  "node_modules/**"
                  "dist/**"
                  ".astro/**"
                  "bun.lock"
                ];
              };
            };
          };

          formatter = config.treefmt.build.wrapper;

          apps.default = {
            type = "app";
            program = "${devScript}/bin/dev";
            meta.description = "Start the Astro dev server (HMR, bound to 0.0.0.0:4321)";
          };

          devShells.default = pkgs.mkShell {
            packages = devPackages;

            shellHook = ''
              echo "${packageJson.name} v${version}"
              echo "/dev/urandom for humans"
              echo ""
              echo "Commands:"
              echo "  dev             - install deps + start dev server on 0.0.0.0:4321 (HMR)"
              echo "  nix run         - same, via flake app"
              echo "  bun install     - install dependencies"
              echo "  bun run build   - build for production"
              echo "  bun run check   - astro check"
              echo "  bun run lint    - eslint"
              echo "  treefmt         - format all files"
              echo ""
            '';
          };
        };
    };
}
