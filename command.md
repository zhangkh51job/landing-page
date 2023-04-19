- mac M1 install nvm and node
  -  show hidden file use quick key => shift + command + .
  -  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"   => install brew
  -  echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
     eval "$(/opt/homebrew/bin/brew shellenv)"      =>  brew will work
  -  brew uninstall --ignore-dependencies node 
     brew uninstall --force node  
  -  brew update
  -  brew install nvm
  -  mkdir ~/.nvm
  -  vim ~/.bash_profile
  -  export NVM_DIR=~/.nvm
     source $(brew --prefix nvm)/nvm.sh   ESC + :wq save this command
  - source ~/.bash_profile  
  - notice: node >15 arm64 can support;node < 15 eg.14 need use rosetta
     -  softwareupdate --install-rosetta
     -  install success => open new terminal => arch -x86_64 zsh => source "${nvm dir}/nvm.sh" eg. source ".nvm/nvm.sh"
     -  after nvm ls => show node 14.x.x  => node -v =>14.x.x
     -  in vscode terminal,use nvm will alert: command not found: nvm,because path not reflect to bash_profile
     -  open ~/.zshrc => if show not such file or .zshrc doer not exist => touch ~/.zshrc => input  source ~/.bash_profile  save and quit
     -  source ~/.zshrc  => nvm or node will show right noticels