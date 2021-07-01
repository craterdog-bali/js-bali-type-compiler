// Generated from src/grammar/Document.g4 by ANTLR 4.8
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by DocumentParser.

function DocumentVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

DocumentVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
DocumentVisitor.prototype.constructor = DocumentVisitor;

// Visit a parse tree produced by DocumentParser#document.
DocumentVisitor.prototype.visitDocument = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#instructions.
DocumentVisitor.prototype.visitInstructions = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#step.
DocumentVisitor.prototype.visitStep = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#label.
DocumentVisitor.prototype.visitLabel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#instruction.
DocumentVisitor.prototype.visitInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#comment.
DocumentVisitor.prototype.visitComment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#skipInstruction.
DocumentVisitor.prototype.visitSkipInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#jumpInstruction.
DocumentVisitor.prototype.visitJumpInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#pushInstruction.
DocumentVisitor.prototype.visitPushInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#pullInstruction.
DocumentVisitor.prototype.visitPullInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#loadInstruction.
DocumentVisitor.prototype.visitLoadInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#saveInstruction.
DocumentVisitor.prototype.visitSaveInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#dropInstruction.
DocumentVisitor.prototype.visitDropInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#callInstruction.
DocumentVisitor.prototype.visitCallInstruction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by DocumentParser#sendInstruction.
DocumentVisitor.prototype.visitSendInstruction = function(ctx) {
  return this.visitChildren(ctx);
};



exports.DocumentVisitor = DocumentVisitor;