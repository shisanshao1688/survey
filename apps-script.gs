/**
 * 机电一体化技术专业调研问卷 - Google Apps Script 后端
 *
 * 部署步骤：
 * 1. 打开 Google Sheets，新建一张表，命名为"调研问卷数据"
 * 2. 扩展程序 → Apps Script
 * 3. 将本文件完整粘贴进去，保存
 * 4. 点击「部署」→「新建部署」→ 类型选「Web 应用」
 * 5. 访问权限设置为「任何人」
 * 6. 部署后复制生成的 URL，填入 index.html 的 SCRIPT_URL
 *
 * Google Sheet 会自动创建三个 Sheet（企业版/毕业生版/在校生版）
 */

// 处理 POST 请求
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { type, payload } = data;

    if (!type || !payload) {
      return ContentService.createTextOutput(JSON.stringify({ code: 1, msg: '数据不完整' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheetName = getSheetName(type);
    const sheet = getOrCreateSheet(sheetName);

    // 如果是该sheet的第一条数据，先写表头
    if (sheet.getLastRow() === 0) {
      writeHeaders(sheet, type);
    }

    // 写入数据行
    const row = buildRow(type, payload);
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      code: 0,
      msg: '提交成功',
      data: { id: sheet.getLastRow(), time: new Date().toLocaleString('zh-CN') }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ code: -1, msg: '服务器错误: ' + err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 处理 GET 请求（健康检查）
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets().map(s => ({
    name: s.getName(),
    rows: s.getLastRow() - 1 // 减去表头
  }));

  const total = sheets.reduce((sum, s) => sum + Math.max(0, s.rows), 0);

  return ContentService.createTextOutput(JSON.stringify({
    code: 0,
    name: '机电一体化技术专业调研问卷系统',
    status: 'running',
    total: total,
    sheets: sheets
  })).setMimeType(ContentService.MimeType.JSON);
}

// 获取或创建工作表
function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// 问卷类型 → sheet 名称
function getSheetName(type) {
  const map = {
    'enterprise': '企业版问卷',
    'graduate': '毕业生版问卷',
    'student': '在校生版问卷'
  };
  return map[type] || '其他';
}

// 写入表头
function writeHeaders(sheet, type) {
  const commonHeaders = ['序号', '提交时间'];

  if (type === 'enterprise') {
    const headers = [
      '企业名称', '企业性质', '企业规模', '所属行业', '企业地址',
      '填表人姓名', '职务', '联系电话',
      '未来3年人才需求', '学历层次需求', '招聘渠道', '起薪水平',
      '知识-机械制图', '知识-电工电子', '知识-PLC', '知识-液压气动',
      '知识-工业机器人', '知识-数控加工', '知识-智能制造',
      '知识-单片机', '知识-故障诊断维修', '知识-车间管理',
      '知识-AI基础', '知识-机械设计基础',
      '能力-设备操作', '能力-安装调试', '能力-维修维护',
      '能力-零部件设计加工', '能力-PLC编程', '能力-机器人操作',
      '能力-产线运维', '能力-设备改造', '能力-创新', '能力-智能机器人',
      '素质-团队协作', '素质-爱岗敬业', '素质-吃苦耐劳',
      '素质-安全意识', '素质-学习能力', '素质-组织协调',
      '素质-计算机', '素质-人文素养',
      '岗位-机床操作', '岗位-设备维修', '岗位-工艺设计',
      '岗位-机器人操作', '岗位-机器人编程', '岗位-机器人设计',
      '岗位-机器人运维', '岗位-智能机器人设计', '岗位-产线运维',
      '岗位-安装调试', '岗位-车间管理', '岗位-销售',
      '校企合作意愿', '合作方式', '接收实习生数量',
      '参与方案制订意愿', '产业嵌入式课程态度',
      '毕业生不足', '课程建议', '合作建议', '未来趋势看法'
    ];
    sheet.getRange(1, 1, 1, commonHeaders.length + headers.length)
      .setValues([[...commonHeaders, ...headers]]);
  } else if (type === 'graduate') {
    const headers = [
      '姓名', '性别', '毕业年份', '生源类型', '生源地', '联系方式',
      '就业状态', '单位名称', '单位性质', '行业', '岗位', '专业对口度', '工作地点',
      '月薪', '换工作次数', '职位层级', '需提升能力', '工作满意度',
      '知识评价-机械制图', '知识评价-电工电子', '知识评价-PLC',
      '知识评价-液压气动', '知识评价-机器人', '知识评价-数控',
      '知识评价-智能制造', '知识评价-单片机', '知识评价-故障诊断', '知识评价-AI',
      '能力评价-设备操作', '能力评价-安装调试', '能力评价-维修维护',
      '能力评价-PLC', '能力评价-机器人', '能力评价-产线运维',
      '能力评价-设计加工', '能力评价-文件阅读', '能力评价-团队协作', '能力评价-学习',
      '总体满意度', '最有帮助课程', '需加强教学', '课程建议', '职业建议', '是否愿参与母校工作'
    ];
    sheet.getRange(1, 1, 1, commonHeaders.length + headers.length)
      .setValues([[...commonHeaders, ...headers]]);
  } else if (type === 'student') {
    const headers = [
      '年级', '性别', '生源类型', '生源地', '选择专业原因',
      '自主学习时间', '预习情况', '作业完成', '求助方式', '学习状态', '专业兴趣', 'AI了解度',
      '课程满意度-机械制图', '课程满意度-电工电子', '课程满意度-工程力学',
      '课程满意度-机械设计', '课程满意度-液压气动', '课程满意度-PLC',
      '课程满意度-运动控制', '课程满意度-单片机', '课程满意度-机器人',
      '课程满意度-数控', '课程满意度-智能制造', '课程满意度-数字化设计',
      '课程满意度-智能机器人', '课程满意度-金工实习', '课程满意度-电工实训', '课程满意度-产线实训',
      '喜欢教学方式', '教学存在问题', '实训满意度', '实训加强方面', '实习满意度', '最重要课程',
      '希望增设课程', '想考证书', '毕业后去向', '期望薪资', '其他建议'
    ];
    sheet.getRange(1, 1, 1, commonHeaders.length + headers.length)
      .setValues([[...commonHeaders, ...headers]]);
  }
  // 冻结首行
  sheet.setFrozenRows(1);
}

// 组装数据行
function buildRow(type, payload) {
  const common = [payload.id || '', new Date().toLocaleString('zh-CN')];

  if (type === 'enterprise') {
    return [...common,
      payload.q1_name || '', payload.q2_type || '', payload.q3_scale || '',
      payload.q4_industry || '', payload.q5_address || '',
      payload.q6_contact || '', payload.q6_position || '', payload.q6_phone || '',
      payload.q7_demand || '', arr(payload.q8_edu), arr(payload.q9_channel),
      payload.q10_salary || '',
      kv(payload.p3_knowledge, 12), kv(payload.p3_ability, 10), kv(payload.p3_quality, 8),
      kv(payload.p4_position, 12),
      payload.q5_willing || '', arr(payload.q6_mode), payload.q7_intern || '',
      payload.q8_plan || '', payload.q9_course || '',
      payload.q10_shortage || '', payload.q11_curriculum || '',
      payload.q12_cooperation || '', payload.q13_future || ''
    ].flat();
  } else if (type === 'graduate') {
    return [...common,
      payload.name || '', payload.gender || '', payload.gradYear || '',
      payload.studentType || '', payload.hometown || '', payload.contact || '',
      payload.empStatus || '', payload.company || '', payload.companyType || '',
      payload.industry || '', payload.position || '', payload.matchRate || '',
      payload.workCity || '',
      payload.salary || '', payload.jobChanges || '', payload.positionLevel || '',
      arr(payload.skillsNeeded), payload.jobSatisfaction || '',
      kv(payload.p4_knowledge, 10), kv(payload.p4_ability, 10),
      payload.overallSatisfaction || '', payload.helpfulCourses || '',
      payload.needImprove || '', payload.curriculumSuggest || '',
      payload.careerSuggest || '', payload.willingHelp || ''
    ].flat();
  } else if (type === 'student') {
    return [...common,
      payload.grade || '', payload.gender || '', payload.studentType || '',
      payload.hometown || '', arr(payload.reasonMajor),
      payload.selfStudyTime || '', payload.previewHabits || '',
      payload.homeworkHabits || '', arr(payload.helpMethod),
      payload.learningStatus || '', payload.majorInterest || '',
      payload.aiLevel || '',
      kv(payload.p3_satisfaction, 16),
      arr(payload.favTeachMethod), arr(payload.teachProblems),
      payload.facilitySat || '', arr(payload.needImproveFacility),
      payload.internSat || '', payload.importantCourses || '',
      arr(payload.wantCourses), arr(payload.wantCertificates),
      payload.afterGraduate || '', payload.expectSalary || '',
      payload.otherSuggest || ''
    ].flat();
  }

  return [...common, JSON.stringify(payload)];
}

// 辅助：数组转逗号分隔字符串
function arr(val) {
  if (Array.isArray(val)) return val.join('；');
  return val || '';
}

// 辅助：键值对象转顺序数组（评价表）
function kv(obj, count) {
  if (!obj || typeof obj !== 'object') return new Array(count).fill('');
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(obj['k' + i] || '');
  }
  return result;
}
