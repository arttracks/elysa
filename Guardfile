guard 'sass',         :input => 'views/sass',   :output => 'public/css'
guard 'coffeescript', :input => 'views/coffee', :output => 'public/js'

guard 'livereload' do
  watch(%r{views/.+\.(erb|haml)$})
  watch(%r{public/.+\.(css|js|html)})
end

guard :bundler do
  watch('Gemfile')
end

guard 'sprockets', :destination => 'public/js', :root_file => 'views/ember/ember-app.js' do
  watch(/views\/ember\/.+\.js/)
end

require 'guard'
require 'guard/plugin'

module ::Guard
  class EmberHandlebars < Guard
    def initialize(watchers = [], options = {})
      super(watchers, options)
      @options = options
      run_all
    end

    def run_all
      run_on_change(Watcher.match_files(self, Dir.glob(File.join('**', '*.*'))))
    end
  
    def run_on_change(paths)
      paths.each do |file|
        output_file = get_output(file)
        FileUtils.mkdir_p File.dirname(output_file)
        File.open(output_file, 'w') { |f| f.write(compile_handlebars(file)) }
        ::Guard::UI.info "Compiled handlebars in '#{file}' to js in '#{output_file}'"
        ::Guard::Notifier.notify("Compiled handlebars in #{file}", :title => "Guard::EmberHandlebars", :image => :success) if @options[:notifications]
      end
      notify paths
    end

    def notify(changed_files)
      ::Guard.guards.reject{ |guard| guard == self }.each do |guard|
        paths = Watcher.match_files(guard, changed_files)
        guard.run_on_change paths unless paths.empty?
      end
    end

  private

    # Get the file path to output the js based on the file being
    # built.  The output path is relative to where guard is being run.
    #
    # @param file [String] path to file being built
    # @return [String] path to file where output should be written
    #
    def get_output(file)
      file_dir = File.dirname(file)
      file_name = File.basename(file).split('.')[0..-2].join('.')
      unless file_name =~ /\.js$/
        file_name << ".js"
      end
      
      file_dir = file_dir.gsub(Regexp.new("#{@options[:input]}(\/){0,1}"), '') if @options[:input]
      file_dir = File.join(@options[:output], file_dir) if @options[:output]

      if file_dir == ''
        file_name
      else
        File.join(file_dir, file_name)
      end
    end

    def compile_handlebars file
      content = IO.read(file)
      name = file.gsub('.handlebars', '')
      name = name.gsub(/^#{@options[:remove_prefix]}/, '')
      begin
        content = content.gsub("\n", '')
        content = content.gsub("'", "\\\\'")
        result = "Ember.TEMPLATES['#{name}'] = Ember.Handlebars.compile('#{content}');"
        result
      rescue StandardError => error
        puts "ERROR COMPILING #{file}: #{error}"
      end
    end    
  end
end

guard 'ember_handlebars', :input => 'views/ember/templates', :output => 'views/ember/temp/compiled_templates', :remove_prefix  => 'views/ember/templates/' do
    watch(/views\/ember\/templates\/.+/)
end
