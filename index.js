const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const pino = require('pino')

const OWNER = "Sir Demon"

async function startStanley() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')
  
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log('📱 Scan this QR code with your spare WhatsApp number!')
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) {
        console.log('🔄 Reconnecting...')
        startStanley()
      }
    }
    if (connection === 'open') {
      console.log('✅ Stanley WhatsApp Bot is ONLINE!')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message) return
    if (msg.key.fromMe) return

    const from = msg.key.remoteJid
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''
    const user = msg.pushName || 'User'
    const now = new Date()

    // ─── START ───
    if (text === '.start' || text === '.menu') {
      await sock.sendMessage(from, { text: `
╭━━━━━━━━━━━━━━━━━━⬡
┃ 𝗦𝗧𝗔𝗡𝗟𝗘𝗬 𝗠𝗗  
┃__________________________
┃ 💎 ᴏᴡɴᴇʀ : ${OWNER}
┃ 🗓️ ᴅᴀᴛᴇ : ${now.toLocaleDateString()}
┃ ⏰ ᴛɪᴍᴇ : ${now.toLocaleTimeString()}
╰━━━━━━━━━━━━━━━━━━⬡
╔━━━━━━━━━━━━━━━━━━❒
║ ⦿ 𝗦𝗧𝗔𝗧𝗨𝗦 : ONLINE 🟢
║ ⦿ 𝗨𝗦𝗘𝗥 : ${user}
╚━━━━━━━━━━━━━━━━━━❒

Hi ${user}! Type .help to see commands 🎉` })
    }

    // ─── HELP ───
    else if (text === '.help') {
      await sock.sendMessage(from, { text: `
┌─〔 Stanley Commands 〕
┃─❐ .start - Start bot
┃─❐ .alive - Bot status
┃─❐ .ping - Test speed
┃─❐ .owner - Owner info
┃─❐ .joke - Random joke
┃─❐ .quote - Random quote
┃─❐ .dadjoke - Dad joke
┃─❐ .funfact - Fun fact
┃─❐ .advice - Get advice
┃─❐ .truth - Truth question
┃─❐ .dare - Dare challenge
┃─❐ .8ball - Magic 8 ball
┃─❐ .roast - Get roasted
┃─❐ .compliment - Compliment
┃─❐ .dice - Roll a dice
┃─❐ .coin - Flip a coin
┃─❐ .time - Current time
┃─❐ .tagall - Tag everyone in group
└──────────────────────` })
    }

    // ─── ALIVE ───
    else if (text === '.alive') {
      await sock.sendMessage(from, { text: '🟢 Stanley Bot is ONLINE and running!' })
    }

    // ─── PING ───
    else if (text === '.ping') {
      await sock.sendMessage(from, { text: '🏓 Pong! Stanley is active!' })
    }

    // ─── OWNER ───
    else if (text === '.owner') {
      await sock.sendMessage(from, { text: `👑 Owner: ${OWNER}\n💬 Stanley Bot made with ❤️` })
    }

    // ─── DICE ───
    else if (text === '.dice') {
      const result = Math.floor(Math.random() * 6) + 1
      await sock.sendMessage(from, { text: `🎲 You rolled: *${result}*` })
    }

    // ─── COIN ───
    else if (text === '.coin') {
      const result = Math.random() > 0.5 ? 'Heads 🪙' : 'Tails 🔄'
      await sock.sendMessage(from, { text: `Coin flip: *${result}*` })
    }

    // ─── JOKE ───
    else if (text === '.joke') {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything! 😄",
        "I told my wife she was drawing her eyebrows too high. She looked surprised. 😂",
        "Why can't you give Elsa a balloon? Because she'll let it go! ❄️",
        "What do you call a fake noodle? An impasta! 🍝",
      ]
      await sock.sendMessage(from, { text: jokes[Math.floor(Math.random() * jokes.length)] })
    }

    // ─── QUOTE ───
    else if (text === '.quote') {
      const quotes = [
        "💬 'The best way to predict the future is to create it.' – Lincoln",
        "💬 'In the middle of difficulty lies opportunity.' – Einstein",
        "💬 'It does not matter how slowly you go, as long as you do not stop.' – Confucius",
        "💬 'Believe you can and you're halfway there.' – Roosevelt",
      ]
      await sock.sendMessage(from, { text: quotes[Math.floor(Math.random() * quotes.length)] })
    }

    // ─── DAD JOKE ───
    else if (text === '.dadjoke') {
      const jokes = [
        "I used to hate facial hair... but then it grew on me. 😅",
        "What do you call cheese that isn't yours? Nacho cheese! 🧀",
        "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
      ]
      await sock.sendMessage(from, { text: jokes[Math.floor(Math.random() * jokes.length)] })
    }

    // ─── FUN FACT ───
    else if (text === '.funfact') {
      const facts = [
        "🤓 Honey never spoils. 3000-year-old honey was found in Egyptian tombs!",
        "🤓 A group of flamingos is called a flamboyance.",
        "🤓 Octopuses have three hearts and blue blood!",
        "🤓 Bananas are berries but strawberries are not! 🍌",
      ]
      await sock.sendMessage(from, { text: facts[Math.floor(Math.random() * facts.length)] })
    }

    // ─── ADVICE ───
    else if (text === '.advice') {
      const advices = [
        "💡 Don't compare your chapter 1 to someone else's chapter 20.",
        "💡 Work hard in silence, let success make the noise.",
        "💡 Small steps every day lead to big results.",
      ]
      await sock.sendMessage(from, { text: advices[Math.floor(Math.random() * advices.length)] })
    }

    // ─── TRUTH ───
    else if (text === '.truth') {
      const truths = [
        "🙋 What is your biggest fear?",
        "🙋 Have you ever lied to your best friend?",
        "🙋 What is the most embarrassing thing you have done?",
        "🙋 Who was your first crush?",
      ]
      await sock.sendMessage(from, { text: truths[Math.floor(Math.random() * truths.length)] })
    }

    // ─── DARE ───
    else if (text === '.dare') {
      const dares = [
        "🎯 Send a voice note singing your favorite song!",
        "🎯 Change your profile picture to a funny face for 1 hour!",
        "🎯 Text someone I love you without explanation!",
        "🎯 Do 10 pushups right now!",
      ]
      await sock.sendMessage(from, { text: dares[Math.floor(Math.random() * dares.length)] })
    }

    // ─── 8BALL ───
    else if (text === '.8ball') {
      const responses = [
        "🎱 It is certain!", "🎱 Without a doubt!", "🎱 Yes, definitely!",
        "🎱 Don't count on it.", "🎱 My sources say no.", "🎱 Very doubtful.",
        "🎱 Ask again later.",
      ]
      await sock.sendMessage(from, { text: responses[Math.floor(Math.random() * responses.length)] })
    }

    // ─── ROAST ───
    else if (text === '.roast') {
      const roasts = [
        "🔥 You are the reason they put instructions on shampoo bottles.",
        "🔥 I would agree with you but then we would both be wrong.",
        "🔥 You have something on your chin... no, the third one.",
      ]
      await sock.sendMessage(from, { text: roasts[Math.floor(Math.random() * roasts.length)] })
    }

    // ─── COMPLIMENT ───
    else if (text === '.compliment') {
      const compliments = [
        "💐 You light up every room you walk into!",
        "💐 You have an amazing sense of humor!",
        "💐 You are more fun than bubble wrap!",
        "💐 You are a great human being. Keep it up! 🌟",
      ]
      await sock.sendMessage(from, { text: compliments[Math.floor(Math.random() * compliments.length)] })
    }

    // ─── TIME ───
    else if (text === '.time') {
      await sock.sendMessage(from, { text: `🕐 Time: ${now.toLocaleTimeString()}\n📅 Date: ${now.toLocaleDateString()}\n🔅 Day: ${now.toLocaleDateString('en-US', {weekday: 'long'})}` })
    }

    // ─── TAGALL ───
    else if (text === '.tagall') {
      try {
        const groupMetadata = await sock.groupMetadata(from)
        const participants = groupMetadata.participants
        let tagList = `📢 *${groupMetadata.subject}*\n\n`
        const mentions = []

        for (const participant of participants) {
          const number = participant.id
          tagList += `@${number.split('@')[0]}\n`
          mentions.push(number)
        }

        await sock.sendMessage(from, {
          text: tagList,
          mentions: mentions
        })
      } catch (err) {
        await sock.sendMessage(from, { text: '❌ This command only works in groups!' })
      }
    }

  })
}

startStanley()
