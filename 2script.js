/**
 * حاسبة المصفوفات التعليمية - الملف البرمجي التنفيذي المطور والمنسق بالكامل
 */

document.addEventListener("DOMContentLoaded", () => {
    matrixDOM.init();
});

const matrixDOM = {
    init() {
        this.btnGenerate = document.getElementById("btn-generate");
        this.btnReset = document.getElementById("btn-reset");
        
        this.btnGenerate.addEventListener("click", () => this.generateInputs());
        this.btnReset.addEventListener("click", () => this.resetAll());
        
        this.generateInputs();
    },
    
    generateInputs() {
        const rowsA = parseInt(document.getElementById("rowsA").value) || 2;
        const colsA = parseInt(document.getElementById("colsA").value) || 2;
        const rowsB = parseInt(document.getElementById("rowsB").value) || 2;
        const colsB = parseInt(document.getElementById("colsB").value) || 2;
        
        this.buildGrid("container-A", "A", rowsA, colsA);
        this.buildGrid("container-B", "B", rowsB, colsB);
    },
    
    buildGrid(containerId, name, rows, cols) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.className = "matrix-input";
                input.id = `cell-${name}-${i}-${j}`;
                // ملء قيم تلقائية عشوائية ذكية للسرعة أثناء الاختبار
                input.value = Math.floor(Math.random() * 9) + 1;
                input.step = "any";
                container.appendChild(input);
            }
        }
    },
    
    getMatrixData(name) {
        const rows = parseInt(document.getElementById(`rows${name}`).value);
        const cols = parseInt(document.getElementById(`cols${name}`).value);
        let matrix = [];
        
        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let j = 0; j < cols; j++) {
                const val = parseFloat(document.getElementById(`cell-${name}-${i}-${j}`).value);
                if (isNaN(val)) return null;
                row.push(val);
            }
            matrix.push(row);
        }
        return { data: matrix, rows, cols };
    },
    
    resetAll() {
        document.getElementById("rowsA").value = 2;
        document.getElementById("colsA").value = 2;
        document.getElementById("rowsB").value = 2;
        document.getElementById("colsB").value = 2;
        document.getElementById("scalar-value").value = 2;
        this.generateInputs();
        document.getElementById("result-section").classList.add("hidden");
    }
};

const uiRenderer = {
    showError(msg) {
        document.getElementById("result-section").classList.remove("hidden");
        document.getElementById("error-message").classList.remove("hidden");
        document.getElementById("error-message").innerText = msg;
        document.getElementById("success-box").classList.add("hidden");
        document.getElementById("result-section").scrollIntoView({ behavior: 'smooth' });
    },
    
    showResult({ formula, type, data, steps }) {
        document.getElementById("result-section").classList.remove("hidden");
        document.getElementById("error-message").classList.add("hidden");
        document.getElementById("success-box").classList.remove("hidden");
        
        document.getElementById("math-formula").innerText = formula;
        
        const outputDiv = document.getElementById("result-matrix-output");
        outputDiv.innerHTML = "";
        
        if (type === "matrix") {
            const table = document.createElement("table");
            table.className = "result-table";
            data.forEach(row => {
                const tr = document.createElement("tr");
                row.forEach(val => {
                    const td = document.createElement("td");
                    td.innerText = Number(val.toFixed(3));
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
            outputDiv.appendChild(table);
        } else {
            const valDiv = document.createElement("div");
            valDiv.className = "single-value-result";
            valDiv.innerText = Number(data.toFixed(3));
            outputDiv.appendChild(valDiv);
        }
        
        const stepsDiv = document.getElementById("steps-output");
        stepsDiv.innerHTML = "";
        steps.forEach(step => {
            const div = document.createElement("div");
            div.className = "step-item";
            div.innerText = step;
            stepsDiv.appendChild(div);
        });
        
        document.getElementById("result-section").scrollIntoView({ behavior: 'smooth' });
    }
};

// العمليات الأساسية المطلوبة والرياضية الصارمة
const matrixOps = {
    add() {
        const A = matrixDOM.getMatrixData("A");
        const B = matrixDOM.getMatrixData("B");
        if (!A || !B) return uiRenderer.showError("خطأ: يرجى ملء حقول المصفوفات بقيم عددية صحيحة.");
        if (A.rows !== B.rows || A.cols !== B.cols) return uiRenderer.showError("خطأ عدم تطابق الأبعاد: عملية الجمع تتطلب مصفوفتين لهما نفس عدد الأسطر والأعمدة.");
        
        let result = [];
        let steps = ["قاعدة الجمع: يتم جمع العناصر المتقابلة والموجودة في نفس السطر والعمود تماماً."];
        
        for (let i = 0; i < A.rows; i++) {
            let row = [];
            for (let j = 0; j < A.cols; j++) {
                let sum = A.data[i][j] + B.data[i][j];
                row.push(sum);
                steps.push(`الموقع [${i+1}, ${j+1}]: ${A.data[i][j]} + ${B.data[i][j]} = ${sum}`);
            }
            result.push(row);
        }
        uiRenderer.showResult({ formula: "المصفوفة الناتجة C = A + B", type: "matrix", data: result, steps });
    },

    subtract() {
        const A = matrixDOM.getMatrixData("A");
        const B = matrixDOM.getMatrixData("B");
        if (!A || !B) return uiRenderer.showError("خطأ: يرجى التحقق من ملء الحقول أولاً.");
        if (A.rows !== B.rows || A.cols !== B.cols) return uiRenderer.showError("خطأ عدم تطابق الأبعاد: عملية الطرح تتطلب تماثل كامل في الأبعاد.");
        
        let result = [];
        let steps = ["قاعدة الطرح: نقوم بطرح عناصر المصفوفة الثانية B من العناصر المتقابلة لها في المصفوفة الأولى A."];
        
        for (let i = 0; i < A.rows; i++) {
            let row = [];
            for (let j = 0; j < A.cols; j++) {
                let diff = A.data[i][j] - B.data[i][j];
                row.push(diff);
                steps.push(`الموقع [${i+1}, ${j+1}]: ${A.data[i][j]} - ${B.data[i][j]} = ${diff}`);
            }
            result.push(row);
        }
        uiRenderer.showResult({ formula: "المصفوفة الناتجة C = A - B", type: "matrix", data: result, steps });
    },

    multiply() {
        const A = matrixDOM.getMatrixData("A");
        const B = matrixDOM.getMatrixData("B");
        if (!A || !B) return uiRenderer.showError("خطأ في قراءة مدخلات الأرقام.");
        if (A.cols !== B.rows) return uiRenderer.showError(`خطأ في شرط الضرب: عدد أعمدة المصفوفة A (${A.cols}) يجب أن يساوي تماماً عدد أسطر المصفوفة B (${B.rows}).`);
        
        let result = Array(A.rows).fill(0).map(() => Array(B.cols).fill(0));
        let steps = ["قاعدة الضرب التبادلي: نضرب عناصر كل سطر أفقي من الأولى في عناصر كل عمود رأسي من الثانية ثم نجمع النواتج الإجمالية."];
        
        for (let i = 0; i < A.rows; i++) {
            for (let j = 0; j < B.cols; j++) {
                let sum = 0;
                let stepStr = `حساب الموقع [${i+1}, ${j+1}]: `;
                for (let k = 0; k < A.cols; k++) {
                    sum += A.data[i][k] * B.data[k][j];
                    stepStr += `(${A.data[i][k]} × ${B.data[k][j]})` + (k < A.cols - 1 ? " + " : "");
                }
                result[i][j] = sum;
                stepStr += ` = ${sum}`;
                steps.push(stepStr);
            }
        }
        uiRenderer.showResult({ formula: "المصفوفة الناتجة المضروبة C = A × B", type: "matrix", data: result, steps });
    },

    scalar(matrixName) {
        const M = matrixDOM.getMatrixData(matrixName);
        const k = parseFloat(document.getElementById("scalar-value").value);
        if (!M || isNaN(k)) return uiRenderer.showError("خطأ: تأكد من كتابة قيم المصفوفة وقيمة معامل الضرب k.");
        
        let result = [];
        let steps = [`قاعدة الضرب بعدد ثابت: نقوم بضرب المعامل k = ${k} في كل عنصر من عناصر المصفوفة منفصلاً.`];
        
        for (let i = 0; i < M.rows; i++) {
            let row = [];
            for (let j = 0; j < M.cols; j++) {
                let val = M.data[i][j] * k;
                row.push(val);
                steps.push(`الموقع [${i+1}, ${j+1}]: ${k} × ${M.data[i][j]} = ${val}`);
            }
            result.push(row);
        }
        uiRenderer.showResult({ formula: `المصفوفة المضاعفة C = ${k} × ${matrixName}`, type: "matrix", data: result, steps });
    },

    transpose(matrixName) {
        const M = matrixDOM.getMatrixData(matrixName);
        if (!M) return uiRenderer.showError("خطأ في معالجة الحقول.");
        
        let result = Array(M.cols).fill(0).map(() => Array(M.rows).fill(0));
        let steps = ["قاعدة المنقول الرياضي: تحويل خطوط الأسطر الأفقية إلى أعمدة عمودية متتالية وسلسة."];
        
        for (let i = 0; i < M.rows; i++) {
            for (let j = 0; j < M.cols; j++) {
                result[j][i] = M.data[i][j];
                steps.push(`تدوير العنصر من الموقع [${i+1}, ${j+1}] إلى الموقع الجديد [${j+1}, ${i+1}] بقيمة: ${M.data[i][j]}`);
            }
        }
        uiRenderer.showResult({ formula: `منقول المصفوفة المولد C = ${matrixName}ᵀ`, type: "matrix", data: result, steps });
    },

    determinant(matrixName) {
        const M = matrixDOM.getMatrixData(matrixName);
        if (!M) return uiRenderer.showError("خطأ.");
        if (M.rows !== M.cols) return uiRenderer.showError("مستحيل رياضياً: المحدد يحسب فقط وفقط للمصفوفات المربعة (الأسطر = الأعمدة).");
        
        let steps = ["عملية حساب المحدد عبر قاعدة تفكيك المتممات والمحددات الصغرى الفرعية:"];
        let det = this.calcDeterminant(M.data, steps);
        uiRenderer.showResult({ formula: `قيمة محدد المصفوفة |${matrixName}|`, type: "value", data: det, steps });
    },

    calcDeterminant(matrix, steps) {
        const n = matrix.length;
        if (n === 1) return matrix[0][0];
        if (n === 2) {
            let d = (matrix[0][0] * matrix[1][1]) - (matrix[0][1] * matrix[1][0]);
            steps.push(`محدد ثنائي أبعاد: (${matrix[0][0]} × ${matrix[1][1]}) - (${matrix[0][1]} × ${matrix[1][0]}) = ${d}`);
            return d;
        }
        
        let det = 0;
        for (let j = 0; j < n; j++) {
            let subMatrix = [];
            for (let i = 1; i < n; i++) {
                let row = matrix[i].filter((_, colIdx) => colIdx !== j);
                subMatrix.push(row);
            }
            let sign = (j % 2 === 0) ? 1 : -1;
            steps.push(`التفكيك المرتكز على السطر الأول، العنصر في العمود [${j+1}]: الإشارة الحاليّة (${sign > 0 ? '+' : '-'}) × القيمة (${matrix[0][j]})`);
            det += sign * matrix[0][j] * this.calcDeterminant(subMatrix, steps);
        }
        return det;
    },

    inverse(matrixName) {
        const M = matrixDOM.getMatrixData(matrixName);
        if (!M) return uiRenderer.showError("خطأ.");
        if (M.rows !== M.cols) return uiRenderer.showError("قيد رياضي: معكوس المصفوفة غير متاح إلا للمصفوفات المربعة فقط.");
        
        let steps = ["لإيجاد المعكوس، نقوم بحساب قيمة المحدد أولاً وضمان عدم مساواته للصفر، ثم نوجد منقول المصفوفة المرافقة (Adjugate)."];
        let det = this.calcDeterminant(M.data, steps);
        
        if (Math.abs(det) < 1e-9) {
            return uiRenderer.showError(`فشل إيجاد المعكوس: قيمة المحدد تساوي صفرًا تماماً، المصفوفة منفردة وشاذة (Singular Matrix) وغير قابلة للعكس نهائياً.`);
        }
        
        steps.push(`المحدد يساوي ${det} وهو رقم متاح، إذاً المصفوفة نظامية ولها معكوس حقيقي.`);
        let invData = this.calcInverse(M.data, det, steps);
        uiRenderer.showResult({ formula: `معكوس المصفوفة ${matrixName}⁻¹ = (1 / |${matrixName}|) × Adj(${matrixName})`, type: "matrix", data: invData, steps });
    },

    calcInverse(matrix, det, steps) {
        const n = matrix.length;
        if (n === 1) return [[1 / matrix[0][0]]];
        
        let adj = Array(n).fill(0).map(() => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                let subMatrix = [];
                for (let r = 0; r < n; r++) {
                    if (r !== i) {
                        subMatrix.push(matrix[r].filter((_, c) => c !== j));
                    }
                }
                let sign = ((i + j) % 2 === 0) ? 1 : -1;
                let dummySteps = [];
                let subDet = this.calcDeterminant(subMatrix, dummySteps);
                adj[j][i] = sign * subDet; 
            }
        }
        
        let inverseResult = Array(n).fill(0).map(() => Array(n).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                inverseResult[i][j] = adj[i][j] / det;
            }
        }
        steps.push("تم حساب المعاملات المرافقة المتممة وقسمة نواتجها على المحدد المجمع الأصلي بنجاح.");
        return inverseResult;
    }
};

function exportResult(action) {
    const formula = document.getElementById("math-formula").innerText;
    const errorVisible = !document.getElementById("error-message").classList.contains("hidden");
    if (errorVisible) return alert("لا توجد مخرجات صالحة للتصدير الدراسي.");
    
    let textContent = `=== وثيقة حل أكاديمية - حاسبة المصفوفات الرقمية ===\n`;
    textContent += `العملية البرمجية المنفذة: ${formula}\n\n`;
    textContent += `--- تسلسل مبرهنات ومراحل الحل الرياضي ---\n`;
    
    const steps = document.querySelectorAll("#steps-output .step-item");
    steps.forEach((st, idx) => {
        textContent += `${idx + 1}) ${st.innerText}\n`;
    });
    
    if (action === "copy") {
        navigator.clipboard.writeText(textContent).then(() => {
            alert("تم نسخ مستند الخطوات الأكاديمية الصافية للذاكرة الفورية! 📋");
        });
    } else if (action === "download") {
        const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Academic_Matrix_Report.txt`;
        link.click();
    }
}