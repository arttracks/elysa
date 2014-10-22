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
      set :fake_db, File.open( "data/lil_things.json", "r" ) { |f| JSON.load( f )}

    end

    helpers do
    end

    get '/' do
      haml :index
    end

    get '/artworkLists' do
      content_type :json

      artworks = settings.fake_db["table"]["record"].collect do |record|
        {id: record["irn"], title: record["TitMainTitle"]}
      end
      return { artwork_list: artworks}.to_json
    end

    get '/artworks/:id' do
      content_type :json
      record = settings.fake_db["table"]["record"].find{|record| record["irn"] == params[:id]}
      return nil if record.nil?
     
      return {artwork: {
        id: params[:id],
        artist: record["CreCreatorRef_tab"]["tuple"]["NamFullName"],
        title: record["TitMainTitle"],
        creationDateEarliest: Date.new(record["CreEarliestDate"].to_i),
        creationDateLatest: Date.new(record["CreLatestDate"].to_i),
        provenance: record["CreProvenance"]
      }}.to_json
    end

    post '/get_structure' do
      content_type :json
      p = params[:provenance]
      MuseumProvenance::Provenance.extract(p).to_json
    end
  end
end