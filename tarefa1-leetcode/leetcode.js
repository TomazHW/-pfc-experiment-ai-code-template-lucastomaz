/**
 * LeetCode Problem: Valid Parentheses
 * 
 * Problema: Dada uma string contendo apenas os caracteres '(', ')', '{', '}', '[' e ']',
 * determine se a string de entrada é válida.
 * 
 * Uma string de entrada é válida se:
 * 1. Parênteses abertos devem ser fechados pelo mesmo tipo.
 * 2. Parênteses abertos devem ser fechados na ordem correta.
 * 3. Cada parêntese fechado tem um parêntese aberto correspondente do mesmo tipo.
 * 
 * Categoria: String, Stack
 * 
 * Exemplo:
 * Input: s = "()"
 * Output: true
 * 
 * Input: s = "()[]{}"
 * Output: true
 * 
 * Input: s = "(]"
 * Output: false
 * 
 * Input: s = "([)]"
 * Output: false
 * 
 * Input: s = "{[]}"
 * Output: true
 */

function isValid(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };

  for (let char of s) {
    if (['(', '[', '{'].includes(char)) {
      stack.push(char);
    } else if ([')', ']', '}'].includes(char)) {
      if (stack.length === 0) return false;
      const top = stack.pop();
      if (top !== pairs[char]) return false;
    }
  }

  return stack.length === 0;
}

  function findFirstError(s) {
  const stack = [];
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const openings = Object.values(pairs);
  const closings = Object.keys(pairs);

  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Caso 1: abertura
    if (openings.includes(char)) {
      stack.push({ char, pos: i });
    }

    // Caso 2: fechamento
    else if (closings.includes(char)) {
      if (stack.length === 0) {
        return {
          valid: false,
          error: `Parêntese de fechamento '${char}' sem abertura correspondente`,
          position: i,
          character: char
        };
      }

      const top = stack.pop();
      if (top.char !== pairs[char]) {
        return {
          valid: false,
          error: `Tipo incompatível: esperado '${Object.keys(pairs).find(k => pairs[k] === top.char)}' mas encontrado '${char}'`,
          position: i,
          character: char
        };
      }
    }
  }

  // Caso 3: sobrou abertura sem fechamento
  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    return {
      valid: false,
      error: `Parêntese de abertura '${unclosed.char}' não foi fechado`,
      position: unclosed.pos,
      character: unclosed.char
    };
  }

  // Caso 4: tudo certo
  return {
    valid: true,
    error: null,
    position: null,
    character: null
  };
}



module.exports = { isValid, findFirstError };
console.log("Início Tarefa 1 - [Chat GPT]");