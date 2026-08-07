<?php
// Get game attributes from post meta
$game_attrs = get_post_meta( $game->ID, 'slot_attrs', true );

// Get taxonomy terms for Provider, Type, and Theme
$provider_terms = get_the_terms( $game->ID, 'sl-provider' );
$type_terms = get_the_terms( $game->ID, 'sl-type' );
$theme_terms = get_the_terms( $game->ID, 'sl-theme' );

// Define attribute labels and their display order
$attribute_labels = [
    'provider' => __( 'Provider', 'slotslaunch' ),
    'type' => __( 'Type', 'slotslaunch' ),
    'theme' => __( 'Theme', 'slotslaunch' ),
    'release' => __( 'Release Date', 'slotslaunch' ),
    'reels' => __( 'Reels', 'slotslaunch' ),
    'payline' => __( 'Paylines', 'slotslaunch' ),
    'rtp' => __( 'RTP', 'slotslaunch' ),
    'volatility' => __( 'Volatility', 'slotslaunch' ),
    'currencies' => __( 'Currencies', 'slotslaunch' ),
    'languages' => __( 'Languages', 'slotslaunch' ),
    'land_based' => __( 'Land Based', 'slotslaunch' ),
    'markets' => __( 'Markets', 'slotslaunch' ),
    'progressive' => __( 'Progressive', 'slotslaunch' ),
    'cluster_slot' => __( 'Cluster Slot', 'slotslaunch' ),
    'scatter_pays' => __( 'Scatter Pays', 'slotslaunch' ),
    'max_exposure' => __( 'Max Exposure', 'slotslaunch' ),
    'min_bet' => __( 'Min Bet', 'slotslaunch' ),
    'max_bet' => __( 'Max Bet', 'slotslaunch' ),
    'max_win_per_spin' => __( 'Max Win per Spin', 'slotslaunch' ),
    'bonus_buy' => __( 'Bonus Buy', 'slotslaunch' ),
    'autoplay' => __( 'Autoplay', 'slotslaunch' ),
    'quickspin' => __( 'Quickspin', 'slotslaunch' ),
    'tumbling_reels' => __( 'Tumbling Reels', 'slotslaunch' ),
    'increasing_multipliers' => __( 'Increasing Multipliers', 'slotslaunch' ),
    'orientation' => __( 'Orientation', 'slotslaunch' ),
    'restrictions' => __( 'Restrictions', 'slotslaunch' ),
];

// Collect attributes with values
$attributes_to_display = [];

// Add Provider, Type, and Theme first (from taxonomies)
if ( ! empty( $provider_terms ) && ! is_wp_error( $provider_terms ) ) {
    $attributes_to_display['provider'] = $provider_terms[0]->name;
}

if ( ! empty( $type_terms ) && ! is_wp_error( $type_terms ) ) {
    $attributes_to_display['type'] = $type_terms[0]->name;
}

if ( ! empty( $theme_terms ) && ! is_wp_error( $theme_terms ) ) {
    $attributes_to_display['theme'] = $theme_terms[0]->name;
}

// Add other attributes from game_attrs if they have values
if ( is_array( $game_attrs ) ) {
    foreach ( $game_attrs as $key => $value ) {
        if ( ! empty( $value ) && ! isset( $attributes_to_display[$key] ) ) {
            if( $key == 'release' ) {
                $value = date( 'F j, Y', strtotime( $value ) );
            }
            if( $value == '1') {
                $value = 'Yes';
            }
            if( $value == '0') {
                $value = 'No';
            }
            $attributes_to_display[$key] = $value;
        }
    }
}

// Only display if we have attributes to show
if ( ! empty( $attributes_to_display ) ) :
    // Separate first row (always visible) from rest (collapsible)
    $first_row_keys = array_slice(array_keys($attributes_to_display), 0, 4); // First 4 items
    $collapsible_keys = array_slice(array_keys($attributes_to_display), 4); // Rest of items
?>
<div class="sl-single-game-container">
<div class="sl-game-attributes align-full">
    <div class="sl-game-attributes-header">
        <h3><?php _e( 'Game Information', 'slotslaunch' ); ?></h3>
        <?php if ( ! empty( $collapsible_keys ) ) : ?>
            <div class="sl-toggle-attributes" onclick="toggleGameAttributes()">
                <?php _e( 'Show More', 'slotslaunch' ); ?>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        <?php endif; ?>
    </div>
    <div class="sl-game-attributes-grid">
        <?php 
        // Display first row (always visible)
        foreach ( $first_row_keys as $key ) : 
            if ( isset( $attribute_labels[$key] ) ) : ?>
                <div class="sl-attribute-item">
                    <div class="sl-attribute-label"><?php echo esc_html( $attribute_labels[$key] ); ?></div>
                    <div class="sl-attribute-value"><?php echo esc_html( $attributes_to_display[$key] ); ?></div>
                </div>
            <?php endif;
        endforeach; 
        
        // Display collapsible items
        foreach ( $collapsible_keys as $key ) : 
            if ( isset( $attribute_labels[$key] ) ) : ?>
                <div class="sl-attribute-item collapsible">
                    <div class="sl-attribute-label"><?php echo esc_html( $attribute_labels[$key] ); ?></div>
                    <div class="sl-attribute-value"><?php echo esc_html( $attributes_to_display[$key] ); ?></div>
                </div>
            <?php endif;
        endforeach; ?>
    </div>
</div>
</div>
<script>
function toggleGameAttributes() {
    const collapsibleItems = document.querySelectorAll('.sl-attribute-item.collapsible');
    const toggleButton = document.querySelector('.sl-toggle-attributes');
    const isExpanded = toggleButton.classList.contains('expanded');
    
    collapsibleItems.forEach(item => {
        if (isExpanded) {
            item.classList.remove('show');
        } else {
            item.classList.add('show');
        }
    });
    
    if (isExpanded) {
        toggleButton.classList.remove('expanded');
        toggleButton.innerHTML = '<?php _e( 'Show More', 'slotslaunch' ); ?> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>';
    } else {
        toggleButton.classList.add('expanded');
        toggleButton.innerHTML = '<?php _e( 'Show Less', 'slotslaunch' ); ?> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>';
    }
}
</script>
<?php endif; ?> 