require "sinatra/base"
require 'sinatra/handlebars'
require 'haml'
require "tilt"
require 'sass'
require 'json'
require 'museum_provenance'

$stdout.sync = true # for foreman logging

module CMOA
  class App < Sinatra::Base
     register Sinatra::Handlebars


    handlebars {
      templates '/js/templates.js', ['views/templates/*']
    }

    configure do
    end

    helpers do
    end

    get '/' do
      haml :index
    end

    get '/provenance' do
      haml :provenance
    end

    post '/get_structure' do
      content_type :json
      p = params[:provenance]
      MuseumProvenance::Provenance.extract(p).to_json
    end
  end
end