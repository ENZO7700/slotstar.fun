<script id="sl-json">
    var sl_json = {
        "@context": "http://schema.org",
        "@type": "VideoGame",
        "name": "<?php echo $game->post_name;?>",
        "url": "<?php echo get_permalink();?>",
        "image": "<?php slotsl_img_url();?>",
        "description": "<?php echo strip_tags( get_the_excerpt() );?>",
        "applicationCategory": [
            "Game"
        ],
        "operatingSystem": "Multi-platform",
        "aggregateRating": {
            "@type": "AggregateRating",
            "itemReviewed": "<?php echo $game->post_name;?>",
            "ratingValue": "<?php echo $rating->rating; ?>",
            "ratingCount": "<?php echo $rating->total; ?>",
            "bestRating": "5",
            "worstRating": "0"
        },
        "author": {
            "@type": "Organization",
            "name": "<?php echo get_bloginfo(); ?>",
            "url": "<?php echo get_bloginfo( 'url' ); ?>"
        }
    }
</script>