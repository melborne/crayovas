require "nokogiri"
require "open-uri"

class String
  def to_obj
    case self
    when /\(\s*(\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3})\s*\)/
      $1.split(',').map(&:to_i)
    when /\d{4}/
      $&.to_i
    when ""
      nil
    else
      self
    end
  end
end

module Crayola
  class Scraper
    URL = "http://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors"
    class << self
      def build
        @html ||= get(URL)
        parse @html
      end

      def to_file(io=CURRENT_DIR+'/crayola/crayola.yml')
        raise IOError, "File exist:#{io}" if File.exist?(io)
        File.open(io, 'w') { |f| YAML.dump build, f }
      end

      def to_yaml
        YAML.dump build
      end

      def get(url)
        @html = Nokogiri::HTML(open url)
      rescue OpenURI::HTTPError => e
        STDERR.puts "HTTP Access Error:#{e}"
        exit
      end

      def parse(html)
        crayons = parse_tables(html)
        crayons = delete_useless(crayons)
        normalize_data(crayons)
      end
      
      def parse_tables(html)
        q = Hash.new{ |h,k| h[k]=[] }
        tables = html.css('.wikitable')
        tables.each_with_index do |tb, i|
          tb.css('tr').each do |tr|
            q[series[i]] << tr.css('td').map do |td|
              hex = td.attr('style')[/#[A-Z0-9]{6}/] rescue nil
              content = td.content ? td.content.to_obj : nil
              hex ? [content, hex] : content
            end
          end
        end
        q
      end

      def series
        @series ||= get_series
      end

      def get_series
        @html ||= get(URL)
        @series = []
        @html.css('.mw-headline').each { |title| @series << title.content }
        @series -= ['Specialty Crayons','See also','References','External links']
      end

      def delete_useless(crayons)
        useless = ['Changeables','Color Mix-Up','Crayons with Glitter','True to Life']
        crayons.delete_if { |name, _| useless.include? name }
      end

      def normalize_data(crayons)
        detailed_tables = ['Standard Colors', 'Metallic FX']
        just_name_tables = crayons.keys - detailed_tables
        detailed_tables.each do |name|
          crayons[name].reject! { |item| item.empty? }
          crayons[name].map! { |color| [*color[1], *color[3..-1]] }
        end
        just_name_tables.each { |name| crayons[name].flatten!(1) }
        crayons
      end

    end
  end
end
