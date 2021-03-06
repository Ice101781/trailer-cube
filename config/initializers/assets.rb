# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )

Rails.application.config.assets.precompile += %w( detector.js )
Rails.application.config.assets.precompile += %w( three_r69.js )
Rails.application.config.assets.precompile += %w( dynamic_textures.js )
Rails.application.config.assets.precompile += %w( objects.js )
Rails.application.config.assets.precompile += %w( helpers.js )
Rails.application.config.assets.precompile += %w( trailers.js )
Rails.application.config.assets.precompile += %w( init.js )

