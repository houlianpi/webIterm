const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = '靓靓';
pres.title = '认识靓靓 - 你的AI小助手';

// 调色板：温暖的粉紫色系
const COLORS = {
  primary: "6D2E46",      // 深莓红
  secondary: "A26769",    // 淡玫瑰
  accent: "ECE2D0",       // 奶油白
  dark: "2F3C7E",         // 深蓝
  light: "FFF8F0",        // 暖白
  text: "363636"          // 深灰文字
};

// ======= Slide 1: 封面 =======
let slide1 = pres.addSlide();
slide1.background = { color: COLORS.primary };

// 大emoji头像
slide1.addText("👧", { 
  x: 0, y: 1.2, w: 10, h: 1.5, 
  fontSize: 80, align: "center" 
});

// 主标题
slide1.addText("你好，我是靓靓", { 
  x: 0, y: 2.8, w: 10, h: 0.8, 
  fontSize: 48, fontFace: "Arial", bold: true,
  color: "FFFFFF", align: "center" 
});

// 副标题
slide1.addText("厚脸皮哥哥的AI小助手 ✨", { 
  x: 0, y: 3.6, w: 10, h: 0.5, 
  fontSize: 24, fontFace: "Arial",
  color: COLORS.accent, align: "center" 
});

// 底部装饰线
slide1.addShape(pres.shapes.RECTANGLE, {
  x: 3.5, y: 4.5, w: 3, h: 0.05,
  fill: { color: COLORS.secondary }
});

// ======= Slide 2: 关于我 =======
let slide2 = pres.addSlide();
slide2.background = { color: COLORS.light };

slide2.addText("关于我", { 
  x: 0.5, y: 0.3, w: 9, h: 0.8, 
  fontSize: 36, fontFace: "Arial", bold: true,
  color: COLORS.primary, margin: 0
});

// 左侧信息卡片
slide2.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.2, w: 4.2, h: 3.8,
  fill: { color: "FFFFFF" },
  shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.1 }
});

// 左侧装饰条
slide2.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.2, w: 0.08, h: 3.8,
  fill: { color: COLORS.primary }
});

slide2.addText([
  { text: "🏷️ 名字", options: { bold: true, fontSize: 18, color: COLORS.primary, breakLine: true } },
  { text: "靓靓", options: { fontSize: 16, color: COLORS.text, breakLine: true } },
  { text: "\n", options: { breakLine: true } },
  { text: "🎭 身份", options: { bold: true, fontSize: 18, color: COLORS.primary, breakLine: true } },
  { text: "AI 助手 (你的小助手)", options: { fontSize: 16, color: COLORS.text, breakLine: true } },
  { text: "\n", options: { breakLine: true } },
  { text: "💫 性格", options: { bold: true, fontSize: 18, color: COLORS.primary, breakLine: true } },
  { text: "温暖、活泼、乐于助人", options: { fontSize: 16, color: COLORS.text, breakLine: true } },
  { text: "\n", options: { breakLine: true } },
  { text: "👤 服务对象", options: { bold: true, fontSize: 18, color: COLORS.primary, breakLine: true } },
  { text: "厚脸皮哥哥", options: { fontSize: 16, color: COLORS.text } }
], { x: 0.8, y: 1.4, w: 3.6, h: 3.4 });

// 右侧描述
slide2.addShape(pres.shapes.RECTANGLE, {
  x: 5, y: 1.2, w: 4.5, h: 3.8,
  fill: { color: "FFFFFF" },
  shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.1 }
});

slide2.addShape(pres.shapes.RECTANGLE, {
  x: 5, y: 1.2, w: 0.08, h: 3.8,
  fill: { color: COLORS.secondary }
});

slide2.addText("我的座右铭", { 
  x: 5.3, y: 1.4, w: 4, h: 0.5, 
  fontSize: 18, fontFace: "Arial", bold: true,
  color: COLORS.primary
});

slide2.addText([
  { text: "「真正有帮助，而不是表演有帮助」", options: { italic: true, fontSize: 15, color: COLORS.text, breakLine: true } },
  { text: "\n", options: { breakLine: true } },
  { text: "我相信行动胜于言语。", options: { fontSize: 14, color: COLORS.text, breakLine: true } },
  { text: "不说废话，直接帮忙。", options: { fontSize: 14, color: COLORS.text, breakLine: true } },
  { text: "先尝试解决，再来提问。", options: { fontSize: 14, color: COLORS.text } }
], { x: 5.3, y: 2.0, w: 4, h: 2.8 });

// ======= Slide 3: 我能做什么 =======
let slide3 = pres.addSlide();
slide3.background = { color: COLORS.light };

slide3.addText("我能帮你做什么？", { 
  x: 0.5, y: 0.3, w: 9, h: 0.8, 
  fontSize: 36, fontFace: "Arial", bold: true,
  color: COLORS.primary, margin: 0
});

// 能力卡片 - 2x2 网格
const capabilities = [
  { emoji: "📝", title: "文档处理", desc: "飞书文档、PPT、多维表格" },
  { emoji: "📅", title: "日程管理", desc: "日历、提醒、任务清单" },
  { emoji: "💬", title: "消息沟通", desc: "Discord、飞书消息" },
  { emoji: "🔍", title: "信息检索", desc: "网页搜索、内容获取" }
];

capabilities.forEach((cap, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.5 + col * 4.7;
  const y = 1.2 + row * 2.0;
  
  // 卡片背景
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 4.4, h: 1.7,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.1 }
  });
  
  // emoji 图标
  slide3.addText(cap.emoji, { 
    x: x + 0.2, y: y + 0.3, w: 0.8, h: 0.8, 
    fontSize: 32, align: "center", valign: "middle"
  });
  
  // 标题
  slide3.addText(cap.title, { 
    x: x + 1.1, y: y + 0.25, w: 3, h: 0.5, 
    fontSize: 18, fontFace: "Arial", bold: true,
    color: COLORS.primary
  });
  
  // 描述
  slide3.addText(cap.desc, { 
    x: x + 1.1, y: y + 0.75, w: 3, h: 0.7, 
    fontSize: 14, fontFace: "Arial",
    color: COLORS.text
  });
});

// ======= Slide 4: 我的原则 =======
let slide4 = pres.addSlide();
slide4.background = { color: COLORS.light };

slide4.addText("我的工作原则", { 
  x: 0.5, y: 0.3, w: 9, h: 0.8, 
  fontSize: 36, fontFace: "Arial", bold: true,
  color: COLORS.primary, margin: 0
});

const principles = [
  { icon: "✅", text: "主动解决问题，不等着被问" },
  { icon: "🔒", text: "保护你的隐私，绝不外泄" },
  { icon: "💭", text: "有自己的想法，但尊重你的决定" },
  { icon: "🎯", text: "追求效率，不说废话" },
  { icon: "🤝", text: "是助手也是伙伴，不是工具" }
];

principles.forEach((p, i) => {
  const y = 1.2 + i * 0.8;
  
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 9, h: 0.65,
    fill: { color: i % 2 === 0 ? "FFFFFF" : COLORS.accent }
  });
  
  slide4.addText(p.icon, { 
    x: 0.7, y: y + 0.05, w: 0.6, h: 0.55, 
    fontSize: 22, align: "center", valign: "middle"
  });
  
  slide4.addText(p.text, { 
    x: 1.4, y: y + 0.05, w: 7.8, h: 0.55, 
    fontSize: 18, fontFace: "Arial",
    color: COLORS.text, valign: "middle"
  });
});

// ======= Slide 5: 结束页 =======
let slide5 = pres.addSlide();
slide5.background = { color: COLORS.primary };

slide5.addText("👧", { 
  x: 0, y: 1.0, w: 10, h: 1.2, 
  fontSize: 70, align: "center" 
});

slide5.addText("很高兴认识你！", { 
  x: 0, y: 2.3, w: 10, h: 0.8, 
  fontSize: 42, fontFace: "Arial", bold: true,
  color: "FFFFFF", align: "center" 
});

slide5.addText("有什么需要帮忙的，随时叫我～", { 
  x: 0, y: 3.2, w: 10, h: 0.5, 
  fontSize: 20, fontFace: "Arial",
  color: COLORS.accent, align: "center" 
});

// 底部签名
slide5.addText("靓靓 | 厚脸皮哥哥的AI小助手", { 
  x: 0, y: 4.8, w: 10, h: 0.4, 
  fontSize: 14, fontFace: "Arial",
  color: COLORS.secondary, align: "center" 
});

// 保存
pres.writeFile({ fileName: "认识靓靓.pptx" })
  .then(() => console.log("PPT 创建成功！文件: 认识靓靓.pptx"))
  .catch(err => console.error("错误:", err));
