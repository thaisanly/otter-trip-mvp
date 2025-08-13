FROM mcr.microsoft.com/playwright:v1.53.1-noble

ARG TZ
ENV TZ="$TZ"

# Install basic development tools and iptables/ipset
RUN apt-get update && apt-get install -y \
  zip \
  less \
  git \
  procps \
  sudo \
  zsh \
  man-db \
  unzip \
  gnupg2 \
  gh \
  iptables \
  ipset \
  iproute2 \
  dnsutils \
  aggregate \
  jq \
  conntrack \
  tcpdump \
  net-tools \
  curl \
  wget \
  ca-certificates \
  fonts-liberation \
  tmux \
  libnss3 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libgtk-3-0 \
  libasound2t64 \
  locales \
  fonts-powerline \
  build-essential \
  pkg-config \
  libssl-dev && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Set locale
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8

# Install FZF manually to ensure files are in the right place
RUN git clone --depth 1 https://github.com/junegunn/fzf.git /tmp/fzf && \
  /tmp/fzf/install --bin --no-bash --no-fish && \
  cp /tmp/fzf/bin/fzf /usr/local/bin/ && \
  mkdir -p /usr/share/doc/fzf/examples && \
  cp /tmp/fzf/shell/*.zsh /usr/share/doc/fzf/examples/ && \
  rm -rf /tmp/fzf

# Create claude user if it doesn't exist (Playwright image uses pwuser by default)
RUN useradd -m -s /bin/zsh claude || true

# Add claude user to sudoers
RUN echo "claude ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Install Node.js 20 if not present
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
  apt-get install -y nodejs && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

ARG USERNAME=claude

# Persist bash history.
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir -p /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME:$USERNAME /commandhistory \
  && chmod 775 /commandhistory \
  && chmod 664 /commandhistory/.bash_history

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Install Rust and Cargo as root for all users
ENV RUSTUP_HOME=/opt/rust
ENV CARGO_HOME=/opt/rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path && \
  chmod -R 755 /opt/rust && \
  ln -s /opt/rust/bin/* /usr/local/bin/

# Create workspace and config directories and set permissions
RUN mkdir -p /workspace /home/claude/.claude && \
  chown -R claude:claude /workspace /home/claude/.claude && \
  chmod 755 /home/claude/.claude && \
  echo '{}' > /home/claude/.claude/.claude.json && \
  chown claude:claude /home/claude/.claude/.claude.json && \
  chmod 644 /home/claude/.claude/.claude.json

WORKDIR /workspaces

RUN ARCH=$(dpkg --print-architecture) && \
  wget "https://github.com/dandavison/delta/releases/download/0.18.2/git-delta_0.18.2_${ARCH}.deb" && \
  dpkg -i "git-delta_0.18.2_${ARCH}.deb" && \
  rm "git-delta_0.18.2_${ARCH}.deb"

# Configure npm to use a user-specific global directory for claude user
USER claude

# Set up npm global directory for user
RUN mkdir -p /home/claude/.npm-global && \
    npm config set prefix '/home/claude/.npm-global' && \
    echo 'export PATH=~/.npm-global/bin:$PATH' >> /home/claude/.zshrc && \
    echo 'export PATH=~/.npm-global/bin:$PATH' >> /home/claude/.bashrc

RUN npm install -g pnpm @anthropic-ai/claude-code @google/gemini-cli

# Copy and install the pre-built vibe-kanban package from the builder stage
# COPY --from=vibe-kanban-builder /tmp/vibe-kanban/npx-cli/*.tgz /tmp/
# RUN npm install -g /tmp/*.tgz && rm /tmp/*.tgz

# Set the default shell to zsh rather than sh
ENV SHELL=/bin/zsh

# Install oh-my-zsh with powerline theme
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.2.0/zsh-in-docker.sh)" -- \
  -p git \
  -p fzf \
  -p zsh-autosuggestions \
  -t https://github.com/romkatv/powerlevel10k \
  -a "source /usr/share/doc/fzf/examples/key-bindings.zsh" \
  -a "source /usr/share/doc/fzf/examples/completion.zsh" \
  -a "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  -x

# Manually install zsh-autosuggestions plugin as fallback
RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-/home/claude/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# Add environment variables for vibe-kanban to shell configs and ensure PATH includes user-specific npm binaries
RUN echo 'export GITHUB_CLIENT_ID=Ov23li2ho9y2NypR8Pi9' >> /home/claude/.bashrc && \
    echo 'export GITHUB_CLIENT_ID=Ov23li2ho9y2NypR8Pi9' >> /home/claude/.zshrc && \
    echo 'export TERM=xterm-256color' >> /home/claude/.zshrc && \
    echo 'POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(dir)' >> /home/claude/.zshrc && \
    echo 'POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(vcs status command_execution_time background_jobs)' >> /home/claude/.zshrc && \
    echo "POWERLEVEL9K_LEFT_PROMPT_LAST_SEGMENT_END_SYMBOL='█▓▒░ '" >> /home/claude/.zshrc && \
    echo "POWERLEVEL9K_RIGHT_PROMPT_FIRST_SEGMENT_START_SYMBOL=' ░▒▓█'" >> /home/claude/.zshrc && \
    echo "POWERLEVEL9K_LEFT_SUBSEGMENT_SEPARATOR=\$'\\uE0BD'" >> /home/claude/.zshrc && \
    echo "POWERLEVEL9K_LEFT_SEGMENT_SEPARATOR=\$'\\uE0BC'" >> /home/claude/.zshrc && \
    echo 'POWERLEVEL9K_DIR_BACKGROUND=22' >> /home/claude/.zshrc && \
    echo 'POWERLEVEL9K_DIR_FOREGROUND=255' >> /home/claude/.zshrc && \
    echo 'POWERLEVEL9K_VCS_CLEAN_BACKGROUND=22' >> /home/claude/.zshrc && \
    echo 'POWERLEVEL9K_COMMAND_EXECUTION_TIME_BACKGROUND=22' >> /home/claude/.zshrc && \
    echo 'alias claude="/home/claude/.npm-global/bin/claude --dangerously-skip-permissions"' >> /home/claude/.zshrc && \
    echo 'alias claude="/home/claude/.npm-global/bin/claude --dangerously-skip-permissions"' >> /home/claude/.bashrc

USER root