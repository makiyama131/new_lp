<?php
function b2b_solution_enqueue_assets() {

    // Google Fonts
    wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap', array(), null );

    // Slick Carousel CSS
    wp_enqueue_style( 'slick-css', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css' );
    wp_enqueue_style( 'slick-theme-css', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css', array('slick-css') );

    // このテーマのメインCSS
    wp_enqueue_style( 'main-style', get_template_directory_uri() . '/css/main.css', array('slick-theme-css') );

    // WordPress付属のjQueryを読み込む
    wp_enqueue_script('jquery');

    // Slick Carousel JS
    wp_enqueue_script( 'slick-js', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js', array('jquery'), '1.8.1', true );

    // このテーマのメインJS
    wp_enqueue_script( 'main-script', get_template_directory_uri() . '/js/main.js', array('slick-js'), '1.0.0', true );
}
add_action( 'wp_enqueue_scripts', 'b2b_solution_enqueue_assets' );
?>