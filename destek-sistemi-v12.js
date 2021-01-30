client.on('message', async msg => {
  
  // DOLDURULACAK YERLER
  let destekkanal = '708575199229902859' // Bir şey yazınca talep açacak kanalın ID
  let destekrol = '708575264854114316' // Açılan kanala müdahale edebilecek destek ekibinin rol ID
  let kategori = '708575356281421875' // Açılan kanalın yerleştirileceği kategori ID
  // DOLDURULACAK YERLER
  
  const reason = msg.content.split(" ").slice(1).join(" ");
  if (msg.channel.id === destekkanal) { 
    if(msg.author.id === ayarlar.sahip) return
    if(msg.author.bot) return
    if (!msg.guild.roles.has(destekrol)) return msg.channel.send(`Sunucuda, belirtilen destek rolü bulunmadığı için destek talebi açılamadı!`);
    if(msg.guild.channels.cache.get(kategori)) {
      let destekno = await db.fetch(`desteknumara`)
      db.add(`desteknumara`, +1)
      msg.guild.createChannel(`destek-${destekno || 0}`, "text").then(c => {
      const category = msg.guild.channels.cache.get(kategori)
      c.setParent(category.id)
      let role = msg.guild.roles.cache.get(destekrol);
      let role2 = msg.guild.roles.cache.find(role => role.name == "everyone");
      c.overwritePermissions(role, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });
      c.overwritePermissions(role2, {
          SEND_MESSAGES: false,
          READ_MESSAGES: false
      });
      c.overwritePermissions(msg.author, {
          SEND_MESSAGES: true,
          READ_MESSAGES: true
      });

      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .addField(`Merhaba ${msg.author.username}!`, `Destek yetkilileri burada seninle ilgilenecektir. \nDestek talebini kapatmak için \`talep kapat\` yazabilirsin.`)
      .addField(`» Kullanıcı:`, msg.author, true)
      .addField(`» Talep Konusu/Sebebi:`, msg.content, true)
      .setFooter(`${client.user.username} Destek Sistemi`, client.user.avatarURL())
      .setTimestamp()
      c.send({ embed: embed });
      c.send(`${msg.author} kişisi destek talebi açtı! @here`)
      msg.delete()
      }).catch(console.error);
    }
  }
});
  
client.on("message", message => {
if (message.content.toLowerCase() === "talep kapat") {
    if (!message.channel.name.startsWith(`destek-`)) return
    if(message.author.bot) return
    message.channel.send(`Destek talebini kapatmayı onaylıyorsan **10 saniye** içinde  \`evet\`  yazmalısın!`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content.toLowerCase() === 'evet', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Destek Talebi kapatma isteğin zaman aşımına uğradı!').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}
});