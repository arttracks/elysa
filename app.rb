require "sinatra/base"
#require 'sinatra/handlebars'
require 'haml'
require "tilt"
require 'sass'
require 'json'
require 'museum_provenance'

$stdout.sync = true # for foreman logging

module CMOA
  class App < Sinatra::Base
    #  register Sinatra::Handlebars

    # handlebars {
    #   templates '/js/templates.js', ['views/templates/*']
    # }

    configure do
    end

    helpers do
    end

    get '/' do
      haml :index
    end

    get '/artworkLists' do
      content_type :json
      return { artwork_list: [
        {id: 1, title: "Wheat"},
        {id: 2, title: "Fields"},
        {id: 3, title: "The Plain of Auvers"}
      ]}.to_json
    end

    get '/artworks/:id' do
      content_type :json
      fake_db = {artwork: {
        id: params[:id],
        artist: "Vincent van Gogh",
        title: "Wheat Fields After the Rain (The Plain of Auvers)",
        creationDate: Date.new(1890,1,1),
        provenance: "Possibly Mme. J. van Gogh-Bonger, Amsterdam; Possibly Mme. Maria Slavona, Paris; Possibly Paul Cassirer Art Gallery, Berlin; Harry Graf von Kessler, Berlin and Weimar, by 1901 until at least 1929 [1]; Reid and Lefevre Art Gallery, London, by 1939 until at least 1941; E. Bignou Art Gallery, New York, NY; Mr. and Mrs. Marshall Field, New York, NY, by 1939 until at least 1958 [2]; Galerie Beyeler, Basel, Switzerland; purchased by Museum, October 1968. NOTES: 1. probably 1897 to likely Fall 1931. 2. Referenced several times between 1939 and 1958.",
      }}.to_json
    end

    post '/get_structure' do
      content_type :json
      p = params[:provenance]
      MuseumProvenance::Provenance.extract(p).to_json
    end
  end
end