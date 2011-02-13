require 'sinatra'
require 'haml'
require "sass"
require "json"
require_relative 'lib/crayola'

configure do
  APP_TITLE = "Crayovas"
  CREDIT = ['hp12c', "http://d.hatena.ne.jp/keyesberry/20110209/p1"]
end

get '/' do
  @title_chars = colorize(APP_TITLE)
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
  
  def colorize(str)
    colors = Crayola::Crayola.colors.map(&:hex).select { |hex| hex !~ /#[0-7]/ }
    str.chars.map { |chr| [chr, colors.sample] }
  end
end

get '/style.css' do
  content_type 'text/css', :charset => 'utf-8'
  sass :style
end