<?php

/**
 * Handles Custom post for slots
 */
class SlotsLaunch_CPT {

	public function __construct() {
		add_action('init',  [ $this, 'slotl_custom_post_type'] );
	}


	/**
	 * Post type definition
	 * @return void
	 */
	public function slotl_custom_post_type(){
		// Set UI labels for Custom Post Type
		$labels = array(
			'name'                => _x( 'Slots', 'Post Type General Name', 'slotslaunch' ),
			'singular_name'       => _x( 'Slot', 'Post Type Singular Name', 'slotslaunch' ),
			'menu_name'           => __( 'Slots', 'slotslaunch' ),
			'parent_item_colon'   => __( 'Parent Slot', 'slotslaunch' ),
			'all_items'           => __( 'All Slots', 'slotslaunch' ),
			'view_item'           => __( 'View Slot', 'slotslaunch' ),
			'add_new_item'        => __( 'Add New Slot', 'slotslaunch' ),
			'add_new'             => __( 'Add New', 'slotslaunch' ),
			'edit_item'           => __( 'Edit Slot', 'slotslaunch' ),
			'update_item'         => __( 'Update Slot', 'slotslaunch' ),
			'search_items'        => __( 'Search Slot', 'slotslaunch' ),
			'not_found'           => __( 'Not Found', 'slotslaunch' ),
			'not_found_in_trash'  => __( 'Not found in Trash', 'slotslaunch' ),
		);

// Set other options for Custom Post Type

		$args = array(
			'label'               => __( 'slots', 'slotslaunch' ),
			'description'         => __( 'Slot news and reviews', 'slotslaunch' ),
			'labels'              => $labels,
			// Features this CPT supports in Post Editor
			'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'comments', 'revisions', 'custom-fields', ),

			/* A hierarchical CPT is like Pages and can have
			* Parent and child items. A non-hierarchical CPT
			* is like Posts.
			*/
			'hierarchical'        => false,
			'public'              => ! slotsl_setting('single-slots'),
			'show_ui'             => true,
			'show_in_menu'        => 'slotsl-settings',
			'show_in_nav_menus'   => true,
			'show_in_admin_bar'   => true,
			'menu_position'       => 5,
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => slotsl_setting('single-slots'),
			'publicly_queryable'  => ! slotsl_setting('single-slots'),
			'capability_type'     => 'post',
			'show_in_rest'        => true,
			'rewrite'             => [ 'slug' => slotsl_setting('slots-slug', 'slots') ]

		);

		// Registering your Custom Post Type
		register_post_type( 'slotsl', apply_filters( 'slotsl/register_post_type', $args ) );

		$labels = array(
			'name'              => _x( 'Provider', 'taxonomy general name', 'textdomain' ),
			'singular_name'     => _x( 'Provider', 'taxonomy singular name', 'textdomain' ),
			'search_items'      => __( 'Search Providers', 'textdomain' ),
			'all_items'         => __( 'All Providers', 'textdomain' ),
			'parent_item'       => __( 'Parent Provider', 'textdomain' ),
			'parent_item_colon' => __( 'Parent Provider:', 'textdomain' ),
			'edit_item'         => __( 'Edit Provider', 'textdomain' ),
			'update_item'       => __( 'Update Provider', 'textdomain' ),
			'add_new_item'      => __( 'Add New Provider', 'textdomain' ),
			'new_item_name'     => __( 'New Provider Name', 'textdomain' ),
			'menu_name'         => __( 'Provider', 'textdomain' ),
		);

		$args = array(
			'hierarchical'      => true,
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'public'            => false,
			'show_in_menu'      => 'slotsl-settings',
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'slot-provider' ),
		);

		register_taxonomy( 'sl-provider', array( 'slotsl' ), apply_filters( 'slotsl/register_taxonomy', $args ) );

		$labels = array(
			'name'              => _x( 'Theme', 'taxonomy general name', 'textdomain' ),
			'singular_name'     => _x( 'Theme', 'taxonomy singular name', 'textdomain' ),
			'search_items'      => __( 'Search Themes', 'textdomain' ),
			'all_items'         => __( 'All Themes', 'textdomain' ),
			'parent_item'       => __( 'Parent Theme', 'textdomain' ),
			'parent_item_colon' => __( 'Parent Theme:', 'textdomain' ),
			'edit_item'         => __( 'Edit Theme', 'textdomain' ),
			'update_item'       => __( 'Update Theme', 'textdomain' ),
			'add_new_item'      => __( 'Add New Theme', 'textdomain' ),
			'new_item_name'     => __( 'New Theme Name', 'textdomain' ),
			'menu_name'         => __( 'Theme', 'textdomain' ),
		);

		$args = array(
			'hierarchical'      => true,
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'public'            => false,
			'show_in_rest'      => true,
			'show_in_menu'      => 'slotsl-settings',
			'show_in_nav_menus' => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'slot-theme' ),
		);

		register_taxonomy( 'sl-theme', array( 'slotsl' ), apply_filters( 'slotsl/register_taxonomy', $args ) );


		$labels = array(
			'name'              => _x( 'Type', 'taxonomy general name', 'textdomain' ),
			'singular_name'     => _x( 'Type', 'taxonomy singular name', 'textdomain' ),
			'search_items'      => __( 'Search Types', 'textdomain' ),
			'all_items'         => __( 'All Types', 'textdomain' ),
			'parent_item'       => __( 'Parent Type', 'textdomain' ),
			'parent_item_colon' => __( 'Parent Type:', 'textdomain' ),
			'edit_item'         => __( 'Edit Type', 'textdomain' ),
			'update_item'       => __( 'Update Type', 'textdomain' ),
			'add_new_item'      => __( 'Add New Type', 'textdomain' ),
			'new_item_name'     => __( 'New Type Name', 'textdomain' ),
			'menu_name'         => __( 'Type', 'textdomain' ),
		);

		$args = array(
			'hierarchical'      => true,
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'public'            => false,
			'show_in_rest'      => true,
			'show_in_menu'      => 'slotsl-settings',
			'show_in_nav_menus' => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'slot-type' ),
		);

		register_taxonomy( 'sl-type', array( 'slotsl' ), apply_filters( 'slotsl/register_taxonomy', $args ) );
		$labels = array(
			'name'              => _x( 'Filter', 'taxonomy general name', 'textdomain' ),
			'singular_name'     => _x( 'Filter', 'taxonomy singular name', 'textdomain' ),
			'search_items'      => __( 'Search Filters', 'textdomain' ),
			'all_items'         => __( 'All Filters', 'textdomain' ),
			'parent_item'       => __( 'Parent Filter', 'textdomain' ),
			'parent_item_colon' => __( 'Parent Filter:', 'textdomain' ),
			'edit_item'         => __( 'Edit Filter', 'textdomain' ),
			'update_item'       => __( 'Update Filter', 'textdomain' ),
			'add_new_item'      => __( 'Add New Filter', 'textdomain' ),
			'new_item_name'     => __( 'New Filter Name', 'textdomain' ),
			'menu_name'         => __( 'Filter', 'textdomain' ),
		);

		$args = array(
			'hierarchical'      => true,
			'labels'            => $labels,
			'show_ui'           => false,
			'show_admin_column' => false,
			'public'            => false,
			'show_in_menu'      => 'slotsl-settings',
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'slot-filter' ),
		);
		// taxonomy for all boolean things
		register_taxonomy( 'sl-filter', array( 'slotsl' ), apply_filters( 'slotsl/register_taxonomy', $args ) );
	}



}

new SlotsLaunch_CPT();