applr.Views.AddNewField = Backbone.View.extend({
	tagName: 'div',

	template: applr.Templates.AddNewField,

	attributes: {
		class: 'applr-add-new-field hide-toggle'
	},

	render: function() {
		var html = this.template(this.model.toJSON());
		this.$el.html(html);
		return this;
	},

	events: {
		'click .add-new-field-button' : 'addNewField'
	},

	addNewField: function() {
		var field_type = this.$el.find('select[name="add-new-field-select"]').val();

		if (field_type != '0') {
			var model = new applr.Models[field_type];
			_OptionalQuestionsCollection.add(model);
		}

		_disableSortable();
		_OptionalQuestionsCollectionView.render();
		_DefaultQuestionCollectionView.render();
		_initSortable();
	}
});