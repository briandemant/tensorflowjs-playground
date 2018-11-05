let Pool = (function() {
	//exposed methods:

	let create = function(type, size) {
		let obj = Object.create(def)
		obj.init(type, size)

		return obj
	}

	//Pool definition:
	let def = {
		_type: null,
		_size: null,
		_pointer: null,
		_elements: null,

		init: function(type, size) {
			this._type = type
			this._size = size
			this._pointer = size
			this._elements = []

			let i = 0
			let length = this._size

			for (i; i < length; ++i) {
				this._elements[i] = this._type.create()
			}
		},

		getElement: function() {
			if (this._pointer > 0) return this._elements[--this._pointer]

			return null
		},

		disposeElement: function(obj) {
			this._elements[this._pointer++] = obj
		},
	}

	return { create: create }
}())