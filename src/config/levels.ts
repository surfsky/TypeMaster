export type Level = {
  id: string
  cat: string
  title: string
  text: string
  fontSize?: number
}

/**关卡配置 */
export const levels: Level[] = [
  // basic
  {
    id: 'base-01',
    cat: '基础',
    title: '中排字母',
    text: `asdf gh jkl; asdf gh jkl;
// 双键重复
aass ddff gghh jjkk ll;; aass ddff gghh jjkk ll;;`,
  },
  {
    id: 'base-02',
    cat: '基础',
    title: '上排字母',
    text: `qwer ty uiop qwer op tyui
qqww eerr ttyy uuii oopp qqww eerr ttyy uuii oopp`,
  },
  {
    id: 'base-03',
    cat: '基础',
    title: '下排字母',
    text: `zxcv bn m,./ zxcv bn m,./
zzxx ccvv bbnn mm,, ././ zzxx ccvv bbnn mm,, ././`,
  },
  {
    id: 'base-04',
    cat: '基础',
    title: '数字',
    text: `1234 56 7890 1234 56 7890 
1122 3344 5566 7788 9900 1122 3344 5566 7788 9900 
1155665 4433221 5544332 5544332 1155665 4433221`,
  },
  {
    id: 'base-05',
    cat: '基础',
    title: '符号',
    text: "`` !@#$ %^ &*() -=[] ;' ,./| !!@@ ##$$ %%^^ &&** (()) --== [[]] ;;'' ,,.. /|/|",
  },
  {
    id: 'base-06',
    cat: '基础',
    title: '综合',
    text: `The quick brown fox jumps over the lazy dog!!!
The quick brown fox jumps over the lazy dog!!!
The quick brown fox jumps over the lazy dog!!!
The quick brown fox jumps over the lazy dog!!!`,
  },

  // english
  {
    id: 'english-01',
    cat: 'English',
    title: '水果 fruits',
    text: `apple orange pear grape banana watermelon peach mango pineapple durian strawberry blueberry raspberry cherry
apple orange pear grape banana watermelon peach mango pineapple durian strawberry blueberry raspberry cherry`,
  },

  // stationery
  {
    id: 'english-02',
    cat: 'English',
    title: '文具 stationery',
    text: `pen pencil paper eraser ruler compass scale tape measure marker crayon notebook folder scissors glue
pen pencil paper eraser ruler compass scale tape measure marker crayon notebook folder scissors glue`,
  },

  // tasty
  {
    id: 'english-03',
    cat: 'English',
    title: '味道 tasty',
    text: `sweet sour salty bitter spicy hot tangy umami creamy buttery nutty fruity herbal earthy smoky garlicky oniony
sweet sour salty bitter spicy hot tangy umami creamy buttery nutty fruity herbal earthy smoky garlicky oniony`,
  },

  // animal
  {
    id: 'anmial-01',
    cat: 'Animal',
    title: '陆生动物 land',
    text: `cat dog goat pig rabbit fox bear tiger lion panda zebra mouse giraffe camel hippo mouse
cat dog goat pig rabbit fox bear tiger lion panda zebra mouse giraffe camel hippo mouse`
  },
  {
    id: 'anmial-02',
    cat: 'Animal',
    title: '树生动物 tree',
    text: `monkey ape gorilla koala sloth squirrel chipmunk kangaroo lemur
monkey ape gorilla koala sloth squirrel chipmunk kangaroo lemur`
  },
  {
    id: 'anmial-03',
    cat: 'Animal',
    title: '鸟类 bird',
    text: `bird pigeon swan goose cock hen sparrow woodpecker owl parrot eagle crane heron flamingo
bird pigeon swan goose cock hen sparrow woodpecker owl parrot eagle crane heron flamingo`
  },
  {
    id: 'anmial-04',
    cat: 'Animal',
    title: '水生动物 water',
    text: `shark salmon goldfish dolphin tuna seal whale octopus squid crab shrimp penguin crocodile
shark salmon goldfish dolphin tuna seal whale octopus squid crab shrimp penguin crocodile`
  },
  {
    id: 'anmial-05',
    cat: 'Animal',
    title: '昆虫 bug',
    text: `ant bee beetle butterfly dragonfly firebug mosquito ladybug spider caterpillar grasshopper cockroach termite
ant bee beetle butterfly dragonfly firebug mosquito ladybug spider caterpillar grasshopper cockroach termite`
  },

  // python
  {
    id: 'python-01',
    cat: 'Python',
    title: '关键字 key words',
    fontSize: 20,
    text: `python string int for in while True False continue break if else elif
python string int for in while True False continue break if else elif`,
  },
  {
    id: 'python-02',
    cat: 'Python',
    title: '方法 functions',
    fontSize: 20,
    text: `input() abs() int() random() shuffle() str() print() len() range() list() dict() set() type() open()
input() abs() int() random() shuffle() str() print() len() range() list() dict() set() type() open()`,
  },
  {
    id: 'python-03',
    cat: 'Python',
    title: 'ui/ai/game',
    fontSize: 20,
    text: `window button menu background play multi total effect sonic servo face compare auto speech recognition emoji game update
window button menu background play multi total effect sonic servo face compare auto speech recognition emoji game update`,
  },

  // ZYB 作业帮
  {
    id: 'zyb-01',
    cat: '作业帮',
    title: 'zyb_ui module',
    fontSize: 20,
    text: `import zyb_ui // 导入作业帮UI模块
zyb_ui.preview(img)   // 预览图片
s = zyb_ui.enter('input password') // 显示一个弹窗，提示输入密码
zyb_ui.message('text', 'pic.jpg')  // 显示一条消息，包含文本和图片
file = zyb_ui.pick_file() // 显示一个弹窗，提示用户选择文件
style = zyb_ui.pick_button('select style', ['cartoon', 'pixel', 'realistic']) // 显示一个弹窗，提示用户选择图片风格
items = zyb_ui.pick_multi('title', dict) // 显示一个弹窗，提示用户选择多个选项
for key in items:  // 遍历用户选择的选项
    print(key, items[key]) // 打印每个选项的键和值
`,
  },
  {
    id: 'zyb-02',
    cat: '作业帮',
    title: 'zyb_ai module',
    fontSize: 20,
    text: `import zyb_ai // 导入作业帮AI模块
zyb_ai.speak('This is a test.') // 语音合成
zyb_ai.chat('Why can the bird fly?') // 聊天
img = zyb_ai.draw('This is picture description', 6) // 绘制图片
zyb_ui.preview(img)   // 预览图片
c = zyb_ai.calorie('food1.jpg') // 计算卡路里
b = zyb_ai.is_animal('1.png') // 判断是否为动物
i = zyb_ai.animal_info('1.png') // 获取动物信息
p = zyb_ai.effect('1.png', 1) // 动物特效
n = zyb_ai.face_compare('a.jpg', 'b.jpg') // 人脸对比
`,
  },
  {
    id: 'zyb-03',
    cat: '作业帮',
    title: 'zyb_xz module',
    fontSize: 20,
    text: `import zyb_xz // 导入作业帮小智模块
zyb_xz.light_on('red')  // 打开红色灯
zyb_xz.light_off()  // 关闭所有灯
zyb_xz.sleep(3)  // 休息3秒
t = zyb_xz.get_time() // 获取当前时间
zyb_xz.music_play('1.mp3') // 播放音乐
zyb_xz.screen('touch fish') // 屏幕触摸
d = zyb_xz.sonic('L1') // 触发声传感器
s = zyb_xz.asr('P2') // 语音识别
zyb_xz.servo('P1', 90) // 控制舵机
zyb_xz.moto_run('M1', 0, 30) // 运行电机
zyb_xz.moto_stop('M1') // 停止电机
`,
  },
  {
    id: 'zyb-04',
    cat: '作业帮',
    title: 'zyb_game module',
    fontSize: 20,
    text: `import zyb_game // 导入作业帮游戏模块
zyb_game.window(800, 600, 'title') // 创建游戏窗口
bg = zyb_game.actor('1.png') // 创建背景演员
while True:
    zyb_game.update() // 更新游戏状态
    key = zyb_game.mouse_down() // 检查鼠标是否按下
    if (key == 'left'):
        bg.image = '2.jpg' // 当按下左键时，改变背景图片
zyb_game.key_down() // 检查键盘是否按下
zyb_game.key_up() // 检查键盘是否松开
zyb_game.music_play() // 播放音乐
zyb_game.shoot() // 发射子弹
zyb_game.move() // 移动演员
zyb_game.prop() // 显示道具
`,
  },
  {
    id: 'zyb-05',
    cat: '作业帮',
    title: 'zyb words',
    fontSize: 20,
    text: `load show key down up shoot move property actor update music play duck piano monster choir
load show key down up shoot move property actor update music play duck piano monster choir`,
  },

  // python exam
  {
    id: 'pythonexam-01',
    cat: 'PythonExam',
    title: '计算 a * b',
    fontSize: 20,
    text: `a = int(input())
b = int(input())
print(a * b)`,
  },
  {
    id: 'pythonexam-02',
    cat: 'PythonExam',
    title: '循环计算几个输入数字的和',
    fontSize: 20,
    text: `s = 0
for i in range(3):
    a = int(input())
    s += a
print(s)`,
  },
  {
    id: 'pythonexam-03',
    cat: 'PythonExam',
    title: '循环输出文本',
    fontSize: 20,
    text: `for i in range(3):
    print('good good study')`,
  },
  {
    id: 'pythonexam-04',
    cat: 'PythonExam',
    title: '逻辑判断',
    fontSize: 20,
    text: `a = int(input())
if a > 20:
    print('greater')
elif a == 20:
    print('equal')
else:
    print('less')`,
  },


]
