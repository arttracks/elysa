require "./app.rb"
require 'rack-livereload'

require 'bundler'
Bundler.require

use Rack::LiveReload, :min_delay => 500, :no_swf => true

run CMOA::App
