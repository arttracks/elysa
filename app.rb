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
      set :things, File.open( "data/thing.json", "r" ) { |f| JSON.load( f )}["thing"]
      set :parties, File.open( "data/party.json", "r" ) { |f| JSON.load( f )}["party"]

    end

    helpers do
      def symbolize_keys(hash)
        hash.inject({}){|result, (key, value)|
          new_key = case key
                    when String then key.to_sym
                    else key
                    end
          new_value = case value
                      when Hash then symbolize_keys(value)
                      else value
                      end
          result[new_key] = new_value
          result
        }
      end
      def maintain_history(data,results)
        results[:id] = data[:id]
        if data[:original_text] != results["original_text"] 
          results[:original_text] = data[:original_text]
          results[:parsable] = (results[:original_text] == results["provenance"])
        end
        results
      end
    end

    get '/' do
      haml :index
    end


    delete '/periods/:id' do
      content_type :json
      {}.to_json
    end


    get '/artworks/:id' do
      content_type :json
      record = settings.things.find{|record| record["id"] == params[:id].to_i}
      creators = record['creators']
      if creators
        record[:artist] = record['creators'].collect do |creator|
          settings.parties.find{|record| record["id"] == creator.to_i}["name"]
        end.join(", ")
        
      end
      return nil if record.nil?
      return {artwork: record}.to_json
    end

    post "/parse_provenance_line" do
      content_type :json
      p = MuseumProvenance::Provenance.extract params[:str]
      p.to_json
    end
    post '/parse_timestring' do
      content_type :json
      p = MuseumProvenance::Period.new("test ")
      p.parse_time_string(params[:str])      
      hash = {}
      hash[:eotb] = p.eotb ? p.eotb.to_time.to_i : nil    
      hash[:eote] = p.eote ? p.eote.to_time.to_i : nil   
      hash[:botb] = p.botb ? p.botb.to_time.to_i : nil
      hash[:bote] = p.bote ? p.bote.to_time.to_i : nil      
      hash[:eotb_precision] = p.beginning.latest_raw.precision rescue nil
      hash[:eote_precision] = p.ending.latest_raw.precision rescue nil
      hash[:botb_precision] = p.beginning.earliest_raw.precision rescue nil 
      hash[:bote_precision] = p.ending.earliest_raw.precision  rescue nil
      hash.to_json
    end

    post '/add_party' do
      content_type :json
      if params[:period]
        data = params[:period].collect do |key,val| 
          symbolize_keys(val)
        end
        results = MuseumProvenance::Provenance.from_json({period: data})
      else 
        results = MuseumProvenance::Timeline.new()
      end
      results.insert_earliest(MuseumProvenance::Period.new(""));
      
      vals = JSON.parse(results.to_json)

      vals["period"] = vals["period"].collect.with_index do |r,i|
        if data.nil?
          r[:id] = "0-#{params['artwork_id']}"
        elsif i == 0
          r[:id] = data[0][:id] + "-" + results.count.to_s
        else
          r = maintain_history(data[i-1],r)
        end
        r
      end
      vals.to_json
    end

    post '/rebuild_structure' do
      content_type :json
      data = params[:period].collect do |key,val| 
        symbolize_keys(val)
      end
      results = MuseumProvenance::Provenance.from_json({period: data}).to_json
      vals = JSON.parse(results)
      vals["period"] = vals["period"].collect.with_index do |r,i|
        maintain_history(data[i],r)
      end
      vals.to_json
    end

    post '/get_structure' do
      content_type :json
      p = params[:provenance]
      MuseumProvenance::Provenance.extract(p).to_json
    end
  end
end