export type Level = {
  id: string
  cat: string
  title: string
  text: string
}

/**关卡配置 */
export const levels: Level[] = [
  // basic
  {
    id: 'base-01',
    cat: '基础',
    title: '中排字母',
    text: 'asdf gh jkl; asdf gh jkl; aass ddff gghh jjkk ll;; aass ddff gghh jjkk ll;;',
  },
  {
    id: 'base-02',
    cat: '基础',
    title: '上排字母',
    text: 'qwer ty uiop qwer op tyui qqww eerr ttyy uuii oopp qqww eerr ttyy uuii oopp',
  },
  {
    id: 'base-03',
    cat: '基础',
    title: '下排字母',
    text: 'zxcv bn m,./ zxcv bn m,./ zzxx ccvv bbnn mm,, ..// zzxx ccvv bbnn mm,, ..//',
  },
  {
    id: 'base-04',
    cat: '基础',
    title: '数字',
    text: '1234 56 7890 1234 56 7890 1122 3344 5566 7788 9900 1122 3344 5566 7788 9900 1155665 4433221 5544332 5544332 1155665 4433221',
  },
  {
    id: 'base-05',
    cat: '基础',
    title: '符号',
    text: "``  !@#$ %^ &*() -=[] ;' ,./|  !!@@ ##$$ %%^^ &&** (()) --== [[]] ;;'' ,,.. //||",
  },
  {
    id: 'base-06',
    cat: '基础',
    title: '综合',
    text: 'The quick brown fox jumps over the lazy dog!!! The quick brown fox jumps over the lazy dog!!! The quick brown fox jumps over the lazy dog!!! The quick brown fox jumps over the lazy dog!!!',
  },

  // english
  {
    id: 'englist-01',
    cat: 'English',
    title: '水果 fruits',
    text: 'apple orange pear grape banana watermelon apple orange pear grape banana watermelon',
  },
  {
    id: 'englist-02',
    cat: 'English',
    title: '动物 animals',
    text: 'cat dog goast pig cock hen rabbit fox bear tiger lion monkey kangaroo panda cat dog goast pig cock hen rabbit fox bear tiger lion monkey kangaroo panda',
  },
  {
    id: 'englist-03',
    cat: 'English',
    title: '文具 stationery',
    text: 'pen pencil paper eraser ruler compass scale tape measure pen pencil paper eraser ruler compass scale tape measure',
  },
  {
    id: 'englist-04',
    cat: 'English',
    title: '味道 tasty',
    text: 'sweet sour salty bitter spicy hot tangy umami creamy buttery nutty fruity herbal earthy smoky gartlicky oniony sweet sour salty bitter spicy hot tangy umami creamy buttery nutty fruity herbal earthy smoky gartlicky oniony',
  },

  // pytonn
  {
    id: 'python-01',
    cat: 'Python',
    title: '关键字 key words',
    text: 'python string int for each while True False continue break if else elif for each while True False continue break if else elif',
  },
  {
    id: 'python-02',
    cat: 'Python',
    title: '方法 functions',
    text: `input() import() int() random() shuffle() str() print() len() range() list() dict() set() type() open() input() import() int() random() shuffle() str() print() len() range() list() dict() set() type() open()`,
  },
  {
    id: 'python-03',
    cat: 'Python',
    title: 'ui/ai/game',
    text: `window button menu background play multi total effect sonic servo face compare auto speech recognition emoji game update window button menu background play multi total effect sonic servo face compare auto speech recognition emoji game update`,
  },

  // ZYB 作业帮
  {
    id: 'zyb-01',
    cat: '作业帮',
    title: 'zyb_ui module',
    text: `import zyb_ui
zyb_ui.preview(img)
s = zyb_ui.enter('input password')
zyb_ui.message('text', 'pic.jpg')
file = zyb_ui.pick_file()
style = zyb_ui.pick_button('select style', ['catoon', 'pixcel', 'realistic'])
items = zyb_ui.pick_multi('title', dict)
for key in items:
    print(key, items[key])
`,
  },
  {
    id: 'zyb-02',
    cat: '作业帮',
    title: 'zyb_ai module',
    text: `import zyb_ai
zyb_ai.speak('This is a test.')
zyb_ai.chat('Why can the bird fly?')
img = zyb_ai.draw('This is picture description', 6)
zyb_ui.preview(img)
c = zyb_ai.calorie('food1.jpg')
b = zyb_ai.is_animal('1.png')
i = zyb_ai.animal_info('1.png')
p = zyb_ai.effect('1.png', 1)
n = zyb_ai.face_compare('a.jpg', 'b.jpg')
`,
  },
  {
    id: 'zyb-03',
    cat: '作业帮',
    title: 'zyb_xz module',
    text: `import zyb_xz
zyb_xz.light_on('red')
zyb_xz.light_off()
zyb_xz.sleep(3)
t = zyb_xz.get_time()
zyb_xz.music_play('1.mp3')
zyb_xz.screen('touch fish')
d = zyb_xz.sonic('L1')
s = zyb_xz.asr('P2')
zyb_xz.servo('P1', 90)
zyb_xz.moto_run('M1', 0, 30)
zyb_xz.moto_stop('M1')
`,
  },
  {
    id: 'zyb-04',
    cat: '作业帮',
    title: 'zyb_game module',
    text: `import zyb_game
zyb_game.window(800, 600, 'title')
bg = zyb_game.actor('1.png')
while True:
    zyb_game.update()
    key = zyb_game.mouse_down()
    if (key == 'left'):
        bg.image = '2.jpg'

zyb_game.key()
zyb_game.shoot()
zyb_game.move()
zyb_game.prop()`,
  },



]