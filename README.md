Elysa
===============

CMOA Provenance entry tool

WIP.

### Installation notes

*( commands to be run in a terminal in the base directory)*

    install git

    # Install Homebrew if it's not installed:
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

    INSTALL RVM
    rvm install 2.1.2

    # Install Elasticsearch
    brew install elasticsearch
 
    # Install foreman globally:
    gem install foreman

    # Update the Ruby Gems
    gem update --system
    gem install bundler
    bundle install


Note that this needs a recent version of Ruby installed on your system.  We've been running it on either 2.0 or 2.1—there's a good chance it might not work on 1.9 or earlier.

## Starting up the software: (run in a terminal in the base directory)

    foreman start

## Opening the page:

<http://localhost:5000>
