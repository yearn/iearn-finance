import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Helmet} from "react-helmet";

class SEO extends Component {

  constructor(props) {
    super()
  }

  render() {
    
    const base_path = 'https://yearn.finance'
    const section = window.location.pathname.substring(1)

    const location = base_path + '/' + section
    const description = section.charAt(0).toUpperCase() + section.slice(1)
    
    var sectionImg = {
      dashboard: base_path + require('../../assets/YFI-logo.png'),
      earn: base_path + require('../../assets/YFI-logo.png'),
      zap: base_path + require('../../assets/YFI-logo.png'),
      experimental: base_path + require('../../assets/YFI-logo.png'),
      lending: base_path + require('../../assets/cream-icon.png'),
      vaults: base_path + require('../../assets/YFI-logo.png'),
      cover: base_path + require('../../assets/cover-icon.png'),
      stats: base_path + require('../../assets/YFI-logo.png'),
    }

    return (
      <Helmet>
        {/* <!-- HTML Meta Tags --> */}
        <meta content="" />
    
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content={ location } />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={ location } />
        <meta property="og:description" content={ description } />
        <meta property="og:image" content={ sectionImg[section] } />
    
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content={ description } />
        <meta name="twitter:title" content={ location }/>
        <meta name="twitter:description" content={ description } />
        <meta name="twitter:image" content={ sectionImg[section] } />
      </Helmet>
    )
  }
}

export default withRouter(SEO);