const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "pixart",
    aliases: ["pix"],
    version: "1.0",
    author: "Dipto",
    countDown: 15,
    role: 0,
    shortDescription: "Generate images powerby by ",
    category: "ai",
    guide: {
      en: "{pn} prompt"
    }
  },

  onStart: async function ({ api, event, args }) {
  const prompt = args.join(" ");
  if (!prompt) {
   return api.sendMessage("❌| Wrong Formet .✅ | Use 17/18 years old boy/girl watching football match on tv and written Dipto and 69 on the back of his Dress , 4k",event.threadID,event.messageID);
  }
    try {
      const fff = ["1oXcpkxHiEtBj0YQYOhnTPWKOb8hQwVrm5YcqQ6IZXlzXy7DLtZsZoTbSvc-ZPLLEEDKZNG54Ba1m_eDBEtefmXBr96VYrBsAmvWThoqKzxYoC6U7sfym6JeMhXZq23f6XhwuJYTTgy92QU1OKzHYC6PlWa4_ZakywYLoAWEz2Ht7ESTBdrJGwB0h3FYKV7suqNiMQb8NWZrjrKP8jhm1aQ","1slzGxdoGhmJn3NeLeUfBm1TBhTRt0ztxuzdSX9qfFD-zCLPdOyGtTo04qQ5McWeVdQit6OU6ECck54r5x1Q1U83reg9oAR0mJVImhDDUqqzlIJ6KM849E_uu_stiEOKiWOZvUygmzcEQb6dz7p_cCk81SQaUZgoxFJpnJGrWODqh31HMw3nW9JRqW1ZBjBSi-3fcxT6_ZHSpBp31AFEUlQ"]
        const col = fff[Math.floor(Math.random() * fff.length)]
      const w = await api.sendMessage("Wait koro baby < 😽", event.threadID);
  
const response = await axios.get(`${global.GoatBot.config.api}/pixart?prompt=${prompt}`)
      const data = response.data.imgUrls;
      if (!data || data.length === 0) {
        api.sendMessage("Empty response or no images generated.",event.threadID,event.messageID);
      }
      const diptoo = [];
      for (let i = 0; i < data.length; i++) {
        const imgUrl = data[i];
        const imgResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'dvassests', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        diptoo.push(fs.createReadStream(imgPath));
      }
      await api.unsendMessage(w.messageID);
      await api.sendMessage({
  body: `✅ | Here's Your Generated Photo<😘`,
        attachment: diptoo
      },event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      await api.sendMessage(`Generation failed!\nError: ${error.message}`,event.threadID, event.messageID);
    }
  }
}
