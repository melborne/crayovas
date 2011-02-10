require 'sinatra'
require 'haml'
require "sass"
require_relative 'lib/crayola'

configure do
  APP_TITLE = "Crayovas"
  CREDIT = ['hp12c', "http://d.hatena.ne.jp/keyesberry/20110209/p1"]
end

get '/' do
  @colors = Crayola::Crayola.colors
              .map { |c| c.notes = c.hex =~ /#[0-7]/ ? "#D0FFD0" : "#424242"; c }
              .group_by { |color| color.series }

  @colors = split_standard(@colors)

  haml :index
end

helpers do
  def split_standard(h)
    std2 = h['Standard Colors'].pop(61)
    h.to_a.insert(1, ['Standard Colors2', std2])
  end
end

get '/style.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :style
end