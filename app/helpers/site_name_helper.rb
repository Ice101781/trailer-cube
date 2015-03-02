module SiteNameHelper

  def site_name_helper
    if params[:controller] == 'static_pages' &&
       params[:action] == 'home'
       'trailer_cube'
    else 
      link_to 'trailer_cube', root_path 
    end
  end

end