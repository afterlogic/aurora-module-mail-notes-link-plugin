'use strict';

module.exports = function (oAppData) {
	var
		_ = require('underscore'),
		$ = require('jquery'),
		ko = require('knockout'),
		
		TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
		
		App = require('%PathToCoreWebclientModule%/js/App.js'),
		ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),

		bNormalUser = App.getUserRole() === window.Enums.UserRole.NormalUser,
		HeaderItemView = null
	;
	
	if (bNormalUser)
	{
		return {
			start: function () {
				
				var
					oMailHeaderItem = ModulesManager.run('MailWebclient', 'getHeaderItem'),
					sNotesHash = ModulesManager.run('MailWebclient', 'getFolderHash', ['Notes'])
				;
				if (oMailHeaderItem.item && _.isFunction(oMailHeaderItem.item.excludedHashes))
				{
					if (!_.isArray(oMailHeaderItem.item.excludedHashes()))
					{
						oMailHeaderItem.item.excludedHashes = ko.observableArray([]);
					}
					oMailHeaderItem.item.excludedHashes.push(sNotesHash);
				}

				App.subscribeEvent('MailWebclient::ConstructView::before', function (oParams) {
					if (oParams.Name === 'CMailView')
					{
						var
							koCurrentFolder = ko.computed(function () {
								return oParams.MailCache.folderList().currentFolder();
							}),
							fTriggerFolders = function () {
								var sFullName = koCurrentFolder() ? koCurrentFolder().fullName() : '';
								if (sFullName === 'Notes')
								{
									$('.folders_panel .middle_bar .panel_center').hide();
									$('.folders_panel .middle_bar .panel_bottom').hide();
									$('.MailLayout .buttons.big_single_button').addClass('new_note_button');
								}
								else
								{
									$('.folders_panel .middle_bar .panel_center').show();
									$('.folders_panel .middle_bar .panel_bottom').show();
									$('.MailLayout .buttons.big_single_button').removeClass('new_note_button');
								}
							}
						;
						
						koCurrentFolder.subscribe(fTriggerFolders);
						fTriggerFolders();
					}
				});
			},
			getHeaderItem: function () {
				if (HeaderItemView === null)
				{
					var 
						CHeaderItemView = require('%PathToCoreWebclientModule%/js/views/CHeaderItemView.js'),
						sNotesHash = ModulesManager.run('MailWebclient', 'getFolderHash', ['Notes'])
					;

					HeaderItemView = new CHeaderItemView(TextUtils.i18n('%MODULENAME%/ACTION_SHOW_NOTES'));
					HeaderItemView.hash(sNotesHash);
					HeaderItemView.baseHash(sNotesHash);
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
