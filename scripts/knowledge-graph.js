function initKnowledgeGraph() {
    const width = 400, height = 400;
    const colorMap = {
        'phase': '#60a5fa',
        'technique': '#34d399',
        'application': '#a78bfa'
    };

    const data = {
        nodes: [
            // 原有 phase 节点保持不变
            { id: 'pretrain', name: '预训练', type: 'phase' },
            { id: 'finetune', name: '微调', type: 'phase' },
            { id: 'inference', name: '推理', type: 'phase' },
            
            // 新增技术节点
            { id: 'lora', name: 'LoRA', type: 'technique' },
            { id: 'quantization', name: '量化推理', type: 'technique' },
            { id: 'parallel', name: '并行计算', type: 'technique' },
            
            // 增强现有技术节点连接
            { id: 'transformer', name: 'Transformer', type: 'technique' },
            { id: 'attention', name: '注意力机制', type: 'technique' },
            { id: 'mlm', name: 'MLM', type: 'technique' },
            { id: 'nsp', name: 'NSP', type: 'technique' },
            
            // 新增应用场景
            { id: 'dialogue', name: '对话系统', type: 'application' },
            { id: 'textgen', name: '文本生成', type: 'application' },
            { id: 'qa', name: '智能问答', type: 'application' }
        ],
        links: [
            // 原有基础连接
            { source: 'pretrain', target: 'transformer' },
            { source: 'pretrain', target: 'mlm' },
            { source: 'pretrain', target: 'nsp' },
            
            // 新增技术连接
            { source: 'finetune', target: 'lora' },
            { source: 'inference', target: 'quantization' },
            { source: 'inference', target: 'parallel' },
            
            // 跨阶段连接
            { source: 'transformer', target: 'attention' },
            { source: 'attention', target: 'textgen' },
            { source: 'lora', target: 'dialogue' },
            { source: 'quantization', target: 'qa' }
        ]
    };

    const svg = d3.select("#knowledgeGraph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width/2, -height/2, width, height]);

    // 力导向图物理模拟
    // 优化物理模拟参数
    const simulation = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody().strength(-80))  // 降低排斥力
        .force("collide", d3.forceCollide(24))              // 缩小碰撞半径
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(60)) // 缩短连接距离
        .force("x", d3.forceX().strength(0.05))
        .force("y", d3.forceY().strength(0.05));

    // 绘制连线
    const link = svg.append("g")
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke", "#4b5563")
        .attr("stroke-width", 1.5);

    // 绘制节点
    const node = svg.append("g")
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 16)
        .attr("fill", d => colorMap[d.type])
        .call(drag(simulation))
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip)
        .on("click", d => {
            if(d.type === 'phase') showSection(d.id);
        });

    // 节点文字标签
    const labels = svg.append("g")
        .selectAll("text")
        .data(data.nodes)
        .join("text")
        .text(d => d.name)
        .attr("text-anchor", "middle")
        .attr("dy", 4)
        .style("fill", "white")
        .style("font-size", "10px");

    // 物理模拟更新
    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
        labels.attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    // 拖拽交互
    function drag(simulation) {
        return d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });
    }
}

function showTooltip(event, d) {
    const tooltip = d3.select("#tooltip");
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(`<strong>${d.name}</strong><br>${getNodeDescription(d)}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
}

function hideTooltip() {
    d3.select("#tooltip").transition().duration(500).style("opacity", 0);
}