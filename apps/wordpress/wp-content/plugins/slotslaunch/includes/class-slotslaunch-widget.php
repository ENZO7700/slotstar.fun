<?php
class SlotsLaunch_Widget extends WP_Widget {

    // Constructor
    public function __construct() {
        parent::__construct(
            'slotsl_widget',
            'SlotsLaunch Widget',
            array('description' => 'Displays slots in the sidebar')
        );
    }

    // Widget Output
    public function widget($args, $instance) {
        $title = apply_filters('widget_title', $instance['title'] ?? '');
        $postIDs = explode(',', $instance['post_ids'] ?? '');
	    $sort = $instance['sort'] ?? 'latest';
        $quantity = intval($instance['quantity'] ?? 5);

        echo $args['before_widget'] ?? '';
        echo $args['before_title'] . $title . $args['after_title'];

        // Display posts based on the selected option and quantity
	    $args = [
		    'post_type'      => 'slotsl',
		    'post__in'       => $postIDs,
		    'posts_per_page' => $quantity,
	    ];
		if ( $sort ==  'random') {
			$args = [
			    'post_type'      => 'slotsl',
			    'post__in'       => $postIDs,
			    'posts_per_page' => $quantity,
			    'orderby'        => 'rand',
		    ];
	    }
		if ( $sort ==  'ids') {
			$args = [
			    'post_type'      => 'slotsl',
			    'post__in'       => $postIDs,
			    'posts_per_page' => $quantity,
			    'orderby'        => 'post__in',
		    ];
	    }

        $lobby_url = slotsl_setting( 'lobby-url', site_url() );
	    $query = new WP_Query($args);
        if ($query->have_posts()) {
            echo '<div class="slotsl-widget">';
            while ($query->have_posts()) {
                $query->the_post();
	            $img = slotsl_img_url();
	            if ( ! $img ) {
		            $img = SLOTSL_PLUGIN_URL . 'public/img/no-image-available.png';
	            }
	            $terms = get_the_terms(get_the_ID(), 'sl-provider' );
                echo '<div class="slotsl-widget-item">';

	                echo '<div class="slotsl-widget-thumb">'.
	                        '<a href="' . slotsl_game_url(get_the_ID()) . '" title="' . get_the_title() . '" >'.
	                                    '<img src="'.$img.'" alt="' . get_the_title() . '" class="w-full">'.
	                        '</a></div>';

		            echo '<div class="slotsl-widget-meta">
			            <div class="slotsl-widget-meta-title">
			                <a href="' . slotsl_game_url(get_the_ID()) . '" title="' . get_the_title() . '" class="relative block">' . get_the_title() . '</a>
			            </div>';

		            echo '<div class="slotsl-widget-meta-provider">';
		            if ( ! apply_filters('slotsl/widget/disable_providers_link', false)  ) {
			            echo '<a href="' . apply_filters( 'slotsl/provider_url', $lobby_url . '?sl-provider='. $terms[0]->slug, $terms[0] ) . '" title="' . $terms[0]->name . '">';
		            }
		            echo $terms[0]->name;
		            if ( ! apply_filters('slotsl/widget/disable_providers_link', false)  ) {
			            echo '</a>';
		            }
						echo '</div>';
	                echo '</div>
	            </div>';
            }
            echo '</div>';
        }

        echo $args['after_widget'] ?? '';
        wp_reset_postdata();
    }

    // Widget Form
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : '';
        $postIDs = !empty($instance['post_ids']) ? $instance['post_ids'] : '';
        $sort = !empty($instance['sort']) ? $instance['sort'] : 'latest';
        $quantity = !empty($instance['quantity']) ? intval($instance['quantity']) : 5;

        ?>
        <p>
            <label for="<?php echo $this->get_field_id('title'); ?>">Title:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
                   name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('post_ids'); ?>">Post IDs (comma separated):</label>
            <input class="widefat" id="<?php echo $this->get_field_id('post_ids'); ?>"
                   name="<?php echo $this->get_field_name('post_ids'); ?>" type="text" value="<?php echo esc_attr($postIDs); ?>">
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('sort'); ?>">Order:</label>
            <select id="<?php echo $this->get_field_id('sort'); ?>"
                    name="<?php echo $this->get_field_name('sort'); ?>">
                <option value="latest" <?php selected($sort, 'latest'); ?>>Latest Posts</option>
                <option value="random" <?php selected($sort, 'random'); ?>>Random Posts</option>
                <option value="ids" <?php selected($sort, 'ids'); ?>>Given IDs</option>
            </select>
        </p>
        <p>
            <label for="<?php echo $this->get_field_id('quantity'); ?>">Quantity:</label>
            <input class="widefat" id="<?php echo $this->get_field_id('quantity'); ?>"
                   name="<?php echo $this->get_field_name('quantity'); ?>" type="number" min="1" value="<?php echo esc_attr($quantity); ?>">
        </p>
        <?php
    }

    // Widget Update
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? sanitize_text_field($new_instance['title']) : '';
        $instance['post_ids'] = (!empty($new_instance['post_ids'])) ? sanitize_text_field($new_instance['post_ids']) : '';
        $instance['sort'] = (!empty($new_instance['sort'])) ? sanitize_text_field($new_instance['sort']) : 'latest';
        $instance['quantity'] = (!empty($new_instance['quantity'])) ? intval($new_instance['quantity']) : 5;
        return $instance;
    }
}

// Register the widget
function register_slotsl_widget() {
    register_widget('SlotsLaunch_Widget');
}
add_action('widgets_init', 'register_slotsl_widget');