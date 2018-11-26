/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/**
 * This library provides functions that format a list of instructions into a
 * into a canonical source code string representing the instructions.
 */
var types = require('./Types');


// PUBLIC FUNCTIONS

/**
 * This class implements a formatter that formats an instruction list into its
 * corresponding source code in a canonical way. If an optional indentation
 * string is specified, then each line of the generated source code will be indented
 * using that string.
 * 
 * @constructor
 * @param {String} indentation A blank string that will be prepended to each indented line in
 * the source code. The default is the empty string.
 * @returns {Formatter} The new component formatter.
 */
function Formatter(indentation) {
    this.indentation = indentation;
    return this;
}
Formatter.prototype.constructor = Formatter;
exports.Formatter = Formatter;


/**
 * This method generates the canonical source code for the specified parse tree
 * component.
 * 
 * @param {List} instructions The list of instructions to be formatted.
 * @returns {String} The source code for the instructions.
 */
Formatter.prototype.formatInstructions = function(instructions) {
    var visitor = new FormattingVisitor(this.indentation);
    instructions.acceptVisitor(visitor);
    return visitor.source;
};


// PRIVATE CLASSES

var EOL = '\n';  // POSIX end of line character


function FormattingVisitor(indentation) {
    this.indentation = indentation ? indentation : '';
    this.source = this.indentation;
    return this;
}
FormattingVisitor.prototype.constructor = FormattingVisitor;

// procedure: EOL* step (EOL step)* EOL* EOF
FormattingVisitor.prototype.visitList = function(procedure) {
    var iterator = procedure.getIterator();
    var step = iterator.getNext();
    step.acceptVisitor(this);
    while (iterator.hasNext()) {
        this.source += EOL + this.indentation;
        step = iterator.getNext();
        step.acceptVisitor(this);
    }
};


// step: label? instruction
// label: EOL? LABEL ':' EOL
FormattingVisitor.prototype.visitCatalog = function(step) {
    var label = step.getValue('$label');
    if (label) {
        // labels are preceded by a blank line unless they are part of the first step
        if (this.source !== '') this.source += EOL;
        this.source += label.getRawString() + ':' + EOL;
    }
    var operation = step.getValue('$operation').toNumber();
    switch (operation) {
        case types.JUMP:
            this.visitJumpInstruction(step);
            break;
        case types.PUSH:
            this.visitPushInstruction(step);
            break;
        case types.POP:
            this.visitPopInstruction(step);
            break;
        case types.LOAD:
            this.visitLoadInstruction(step);
            break;
        case types.STORE:
            this.visitStoreInstruction(step);
            break;
        case types.INVOKE:
            this.visitInvokeInstruction(step);
            break;
        case types.EXECUTE:
            this.visitExecuteInstruction(step);
            break;
        case types.HANDLE:
            this.visitHandleInstruction(step);
            break;
        default:
            throw new Error('FORMATTER: An invalid instruction operation was passed: ' + types.operationString(operation));
    }
};


// jumpInstruction:
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'NONE' |
//     'JUMP' 'TO' LABEL 'ON' 'TRUE' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE'
FormattingVisitor.prototype.visitJumpInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier');
    if (!modifier) {
        this.source += 'SKIP INSTRUCTION';
    } else {
        this.source += 'JUMP TO ';
        var operand = instruction.getValue('$operand').getRawString();
        this.source += operand;
        modifier = modifier.toNumber();
        if (modifier !== types.ON_ANY) {
            this.source += ' ';
            this.source += types.jumpModifierString(modifier);
        }
    }
};


// pushInstruction:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'ELEMENT' LITERAL |
//     'PUSH' 'SOURCE' LITERAL
FormattingVisitor.prototype.visitPushInstruction = function(instruction) {
    this.source += 'PUSH ';
    var modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.pushModifierString(modifier);
    this.source += ' ';
    var operand = instruction.getValue('$operand');
    if (modifier !== types.HANDLER) {
        // format the operand as a literal
        operand = '`' + operand + '`';
    } else {
        // format the operand as a label (which is stored as a Bali Text element)
        operand = operand.getRawString();
    }
    this.source += operand;
};


// popInstruction:
//     'POP' 'HANDLER' |
//     'POP' 'COMPONENT'
FormattingVisitor.prototype.visitPopInstruction = function(instruction) {
    this.source += 'POP ';
    var modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.popModifierString(modifier);
};


// loadInstruction:
//     'LOAD' 'VARIABLE' SYMBOL |
//     'LOAD' 'PARAMETER' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL
FormattingVisitor.prototype.visitLoadInstruction = function(instruction) {
    this.source += 'LOAD ';
    var modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.loadModifierString(modifier);
    this.source += ' ';
    var operand = instruction.getValue('$operand').getRawString();
    this.source += operand;
};


// storeInstruction:
//     'STORE' 'VARIABLE' SYMBOL |
//     'STORE' 'DRAFT' SYMBOL |
//     'STORE' 'DOCUMENT' SYMBOL |
//     'STORE' 'MESSAGE' SYMBOL
FormattingVisitor.prototype.visitStoreInstruction = function(instruction) {
    this.source += 'STORE ';
    var modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.storeModifierString(modifier);
    this.source += ' ';
    var operand = instruction.getValue('$operand').getRawString();
    this.source += operand;
};


// invokeInstruction:
//     'INVOKE' SYMBOL |
//     'INVOKE' SYMBOL 'WITH' 'PARAMETER' |
//     'INVOKE' SYMBOL 'WITH' NUMBER 'PARAMETERS'
FormattingVisitor.prototype.visitInvokeInstruction = function(instruction) {
    this.source += 'INVOKE ';
    this.source += instruction.getValue('$operand');
    var modifier = instruction.getValue('$modifier').toNumber();
    if (modifier > 0) {
        this.source += ' WITH ';
        if (modifier > 1) {
            this.source += modifier;
            this.source += ' PARAMETERS';
        } else {
            this.source += 'PARAMETER';
        }
    }
};


// executeInstruction:
//     'EXECUTE' SYMBOL |
//     'EXECUTE' SYMBOL 'WITH' 'PARAMETERS' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' 'WITH' 'PARAMETERS'
FormattingVisitor.prototype.visitExecuteInstruction = function(instruction) {
    this.source += 'EXECUTE ';
    this.source += instruction.getValue('$operand');
    var modifier = instruction.getValue('$modifier').toNumber();
    if (modifier !== types.SANS) {
        this.source += ' ';
        this.source += types.executeModifierString(modifier);
    }
};


// handleInstruction:
//     'HANDLE' 'EXCEPTION' |
//     'HANDLE' 'RESULT'
FormattingVisitor.prototype.visitHandleInstruction = function(instruction) {
    this.source += 'HANDLE ';
    var modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.handleModifierString(modifier);
};