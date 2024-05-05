const axios = require("axios");

async function getAvatarUrls(userIDs) {
    let avatarURLs = [];
    for (let userID of userIDs) {
        let url = `https://graph.facebook.com/${userID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        avatarURLs.push(url);
    }
    return avatarURLs;
}

module.exports = {
    config: {
        name: "gcimg",
        aliases: ["gcimage", "grpimage"],
        version: "1.0",
        author: "Dipto",
        countDown: 5,
        role: 0,
        description: "𝗚𝗲𝘁 𝗚𝗿𝗼𝘂𝗽 𝗜𝗺𝗮𝗴𝗲",
        category: "𝗜𝗠𝗔𝗚𝗘",
        guide: "{pn} --color [color] --bgcolor [color] --admincolor [color] --membercolor [color]"
    },

    onStart: async function ({ api, args, event, message }) {
        try {
            let tid;
            let color = "red";
            let bgColor = ""; 
            let adminColor = ""; 
            let memberColor = ""; 

            for (let i = 0; i < args.length; i++) {
                switch (args[i]) {
                    case "--color":
                        color = args[i + 1];
                        args.splice(i, 2);
                        break;
                    case "--bgcolor":
                        bgColor = args[i + 1];
                        args.splice(i, 2); 
                        break;
                    case "--admincolor":
                        adminColor = args[i + 1];
                        args.splice(i, 2);
                        break;
                    case "--membercolor":
                        memberColor = args[i + 1];
                        args.splice(i, 2); 
                        break;
                }
            }

            let threadInfo = await api.getThreadInfo(event.threadID);
            let participantIDs = threadInfo.participantIDs;
            let adminIDs = threadInfo.adminIDs.map(admin => admin.id);
            let memberURLs = await getAvatarUrls(participantIDs);
            let adminURLs = await getAvatarUrls(adminIDs);

            const data2 = {
                memberURLs: memberURLs,
                groupPhotoURL: threadInfo.imageSrc,
                adminURLs: adminURLs,
                groupName: threadInfo.threadName,
                bgcolor: bgColor,
                admincolor: adminColor,
                membercolor: memberColor,
                color: color
            };

            if (data2) {
                var waitingMsg = await api.sendMessage("⏳ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚊 𝚠𝚑𝚒𝚕𝚎.", event.threadID);
                api.setMessageReaction("⏳", event.messageID, (err) => {}, true)
            }
                const { data } = await axios.post('https://noobs-api.onrender.com/dipto/groupPhoto', data2);

                if(data.img){
                api.setMessageReaction("✅", event.messageID, (err) => {}, true)
                message.unsend(waitingMsg.messageID);
                message.reply({
                  body: `𝙷𝚎𝚛𝚎 𝚒𝚜 𝚢𝚘𝚞𝚛 𝚐𝚛𝚘𝚞𝚙 𝚒𝚖𝚊𝚐𝚎 <😘`,
                  attachment: await global.utils.getStreamFromURL(data.img)
            });
               }
        } catch (error) {
            console.log(error);
            message.reply(`❌ | 𝙴𝚛𝚛𝚘𝚛: ${error.message}`);
        };
    }
};
