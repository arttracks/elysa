require "./app.rb"
require "rack/jekyll"
require 'rack-livereload'

require 'bundler'
Bundler.require

use Rack::LiveReload, :min_delay => 500, :no_swf => true


jekyll_options = {
   :config => "docs/_config.yml",
   'destination' => "docs/_site",
   'source' => 'docs'
}

run Rack::URLMap.new(
  '/' => CMOA::App.new,                              # Sinatra site
  "/docs" => Rack::Directory.new( "docs/public" ),   # Documentation static content
  '/docs' => Rack::Jekyll.new( jekyll_options),      # Serve our static content   
  "/apidocs" => Rack::Directory.new( "docs/api" ),       # Documentation static content                 
)

