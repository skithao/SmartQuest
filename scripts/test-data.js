// 测试数据生成器
const fs = require('fs');
const path = require('path');

const testCases = {
  // 智能客服测试数据
  customerService: [
    {
      input: "我的订单什么时候发货？",
      expected: ["物流信息", "预计", "工作日"]
    },
    {
      input: "如何退换商品？",
      expected: ["退换货政策", "7天无理由", "联系客服"]
    }
  ],

  // 论文辅助测试数据
  academicWriting: [
    {
      prompt: "生成AI伦理相关的论文大纲",
      sections: ["引言", "方法论", "伦理框架", "案例分析"]
    },
    {
      prompt: "推荐5篇Transformer架构的最新论文",
      expectedKeywords: ["Attention Mechanism", "2023", "arXiv"]
    }
  ],

  // 法律咨询测试数据
  legalConsultation: [
    {
      query: "劳动合同纠纷解决方案",
      expected: ["劳动法", "仲裁", "赔偿金"],
      stats: ["98%", "相似案例"]
    },
    {
      query: "网络侵权责任认定",
      clauses: ["民法典第1194条", "网络服务提供者", "连带责任"]
    }
  ],

  // 情感分析测试数据
  sentimentAnalysis: [
    {
      text: "这个产品太棒了，完全超出我的预期！",
      expectedScore: 0.95
    },
    {
      text: "服务非常差，再也不会购买这个品牌的产品",
      expectedScore: 0.15
    },
    {
      text: "中规中矩，没有特别突出的地方",
      expectedScore: 0.55
    }
  ]
};

// 保存测试数据
const savePath = path.join(__dirname, '../test-data.json');
fs.writeFileSync(savePath, JSON.stringify(testCases, null, 2));

console.log('测试数据已生成至: ' + savePath);