window.applr = (function(applr, $){
	//private variables and functions
	var
		_debug = true,
		_detectQuestionModel = function(el) {
			var result = false;

			if (el.type == 'open') {
				if (el.options.limit > 0 && el.options.limit <= applr.Defaults.textfieldMaxLimit) {
					result = 'Textfield';
				} else if (el.options.limit > 0 && el.options.limit <= applr.Defaults.textareaMaxLimit && el.options.limit > applr.Defaults.textfieldMaxLimit) {
					result = 'Textarea';
				}
			} else if (el.type == 'closed') {
				if (el.options.style == 'dropdown') {
					result = 'Dropdown';
				} else if (el.options.style == 'radiobuttons') {
					result = 'Radiobuttons';
				}
			}

			return result;
		},

		_initSortable = function() {
			$('#applr-optional-questions-list, #applr-default-questions-list').sortable({
				connectWith: "." + _options.question_list_wrapper_class
			}).disableSelection();
		},
		_initAddNewField = function() {
			_AddNewFieldModel = new applr.Models.AddNewField();
			_AddNewFieldView = new applr.Views.AddNewField({model:_AddNewFieldModel});

			_AddNewFieldView.render().$el.appendTo(_options.container);
		},

		_initSaveSettings = function() {
			_saveSettingsView = new applr.Views.SaveSettings();
			_saveSettingsView.render().$el.appendTo(_options.container);
		}
	;

	var facade = {
		//public variables and functions
		init: function(options) {
			this.setOptions(options);

			_containerObj = $(_options.container);

			_DefaultQuestionCollection = new applr.Collections.DefaultQuestions;
			_OptionalQuestionsCollection = new applr.Collections.OptionalQuestions;

			_DefaultQuestionCollectionView = new applr.Views.DefaultQuestions({collection: _DefaultQuestionCollection});
			_OptionalQuestionsCollectionView = new applr.Views.OptionalQuestions({collection: _OptionalQuestionsCollection});
		},
		getOptions: function() {
			return _options;
		},
		setOptions: function(options) {
			_options = _.extend(_options, options)
		},
		restoreFromJSON: function(JSON) {
			if (typeof JSON.default == 'object' && JSON.default.length > 0) {
				_.each(JSON.default, function(el){
					var modelName = _detectQuestionModel(el);
					if (modelName) {
						var model = new applr.Models[modelName](el);
						_DefaultQuestionCollection.add(model);
					}
				});
			}
			if (typeof JSON.optional == 'object' && JSON.default.length > 0) {
				_.each(JSON.optional, function(el){
					var modelName = _detectQuestionModel(el);
					if (modelName) {
						var model = new applr.Models[modelName](el);
						_OptionalQuestionsCollection.add(model);
					}
				});
			}

			_DefaultQuestionCollectionView.render().$el.appendTo(_options.container);
			_OptionalQuestionsCollectionView.render().$el.appendTo(_options.container);

			_initAddNewField();
			_initSaveSettings();
			_initSortable();
		},
		getJSON: function() {
			return _getJSON();
		},
		saveSettings: function() {
			return _saveSettings();
		}
	};

	//debug functions
	if (_debug) {
		_.extend(facade, applr, {
			getDefaultQuestionCollection: function() {
				return _DefaultQuestionCollection;
			},
			getOptionalQuestionsCollection: function() {
				return _OptionalQuestionsCollection;
			}
		});
	}

	return facade;
})(applr, jQuery);