<?php
class Slotslaunch_Rating {
	public $rating = 0;
	public $total = 0;
	private $rating_meta;

	function __construct( $slot_id ) {
		$this->rating_meta = get_post_meta( $slot_id, 'slotsl_rating', true );
		if ( ! empty( $this->rating_meta ) ) {
			if( strtotime( $this->rating_meta['date'] ) > strtotime( '-1 day' ) ) {
				$this->total = $this->rating_meta['total'];
				$this->rating = $this->rating_meta['rating'];
			}
		}
	}

	function __get( $name )  {
		return $this->$name;
	}
}