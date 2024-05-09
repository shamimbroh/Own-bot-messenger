const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "whitelistthread",
    aliases: ["wlt"],
		version: "1.5",
		author: "NTKhang",
		countDown: 5,
		role: 0,
    description: {
			vi: "Thêm, xóa, sửa quyền whiteListThreadIds",
			en: "Add, remove, edit whiteListThreadIds role"
		},
		category: "owner",
		guide: {
			vi: '   {pn} [add | -a] <tid>: Thêm quyền whiteListThreadIds cho người dùng'
				+ '\n	  {pn} [remove | -r] <tid>: Xóa quyền whiteListThreadIds của người dùng'
				+ '\n	  {pn} [list | -l]: Liệt kê danh sách whiteListThreadIds',
			en: '   {pn} [add | -a] <tid>: Add whiteListThreadIds role for thread'
				+ '\n	  {pn} [remove | -r] <tid>: Remove whiteListThreadIds role of thread'
				+ '\n	  {pn} [list | -l]: List all whiteListThreadIds'
		}
	},

	langs: {
		vi: {
			added: "✅ | Đã thêm quyền whiteListThreadIds cho %1 người dùng:\n%2",
			alreadyAdmin: "\n⚠️ | %1 người dùng đã có quyền whiteListThreadIds từ trước rồi:\n%2",
			missingIdAdd: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền whiteListThreadIds",
			removed: "✅ | Đã xóa quyền whiteListThreadIds của %1 người dùng:\n%2",
			notAdmin: "⚠️ | %1 người dùng không có quyền whiteListThreadIds:\n%2",
			missingIdRemove: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền whiteListThreadIds",
			listAdmin: "👑 | Danh sách whiteListThreadIds:\n%1"
		},
		en: {
			added: "✅ | Added whiteListThreadIds role for %1 thread:\n%2",
			alreadyAdmin: "\n⚠️ | %1 thread already have whiteListThreadIds role:\n%2",
			missingIdAdd: "⚠️ | Please enter TID to add whiteListThreadIds role",
			removed: "✅ | Removed whiteListThreadIds role of %1 thread:\n%2",
			notAdmin: "⚠️ | %1 users don't have whiteListIds role:\n%2",
			missingIdRemove: "⚠️ | Please enter TID to remove whiteListThreadIds role",
			listAdmin: "👑 | List of whiteListThreadIds:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang, api }) {
      const permission = global.GoatBot.config.DEV;
    if (!permission.includes(event.senderID)) {
      api.sendMessage(args.join(' '), event.threadID, event.messageID);
      return;
    }
		switch (args[0]) {
			case "add":
			case "-a":
            case "+": {
				if (args[1]) {
					let tids = [];
					if (tids.push(event.threadID));
					else
						tids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const authorIds = [];
					for (const tid of tids) {
						if (config.whiteListModeThread.whiteListThreadIds.includes(tid))
							authorIds.push(tid);
						else
							notAdminIds.push(tid);
					}

					config.whiteListModeThread.whiteListThreadIds.push(...notAdminIds);
					const getNames = await Promise.all(tids.map(tid => usersData.getName(tid).then(name => ({ tid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ tid, name }) => `• ${name} (${tid})`).join("\n")) : "")
						+ (authorIds.length > 0 ? getLang("alreadyAdmin", authorIds.length, authorIds.map(tid => `• ${tid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "remove":
			case "-r":
            case "-": {
              if (args[1]) {
                let tids = [];
                if (tids.push(event.threadID));
                else
                  tids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const authorIds = [];
					for (const tid of tids) {
						if (config.whiteListModeThread.whiteListThreadIds.includes(tid))
							authorIds.push(tid);
						else
							notAdminIds.push(tid);
					}
					for (const tid of authorIds)
						config.whiteListModeThread.whiteListThreadIds.splice(config.whiteListModeThread.whiteListThreadIds.indexOf(tid), 1);
					const getNames = await Promise.all(authorIds.map(tid => usersData.getName(tid).then(name => ({ tid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(authorIds.length > 0 ? getLang("removed", authorIds.length, getNames.map(({ tid, name }) => `• ${name} (${tid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(tid => `• ${tid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "list":
			case "-l": {
				const getNames = await Promise.all(config.whiteListModeThread.whiteListThreadIds.map(tid => usersData.getName(tid).then(name => ({ tid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ tid, name }) => `• ${name} (${tid})`).join("\n")));
			}
			default:
				return message.SyntaxError();
		}
	}
};
