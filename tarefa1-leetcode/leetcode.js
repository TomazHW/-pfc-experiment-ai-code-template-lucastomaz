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
  // Implementar aqui
  return false;
}


function findFirstError(s) {
  // Implementar aqui
  return { valid: false, error: null, position: 0, character: '' };
}

module.exports = { isValid, findFirstError };
console.log("Início Tarefa 1 - [Chat GPT]");