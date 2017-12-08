'use strict';

module.exports = function (oAppData) {
	var
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),

		bNormalUser = App.getUserRole() === Enums.UserRole.NormalUser,
		HeaderItemView = null
	;
	
	if (bNormalUser)
	{
		return {
			getHeaderItem: function () {
				if (HeaderItemView === null)
				{
					var 
						CHeaderItemView = require('%PathToCoreWebclientModule%/js/views/CHeaderItemView.js'),
						sNotesHash = ModulesManager.run('MailWebclient', 'getFolderHash', ['Notes'])
					;

					HeaderItemView = new CHeaderItemView(TextUtils.i18n('%MODULENAME%/ACTION_SHOW_NOTES'));
					HeaderItemView.hash(sNotesHash);
					HeaderItemView.hash.subscribe(function () {
						HeaderItemView.hash(sNotesHash);
					});
				}

				return {
					item: HeaderItemView,
					name: 'notes-tab-link'
				};
			}
		};
	}
	
	return null;
};
