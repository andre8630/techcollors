export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro interno nao esperado", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com suporte";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Serviço não disponivel", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verifique se o serviço esta disponivel";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Metodo nao permitido nesse endpoint");
    this.name = "MethodNotAllowedError";
    this.action = "Use o metodo GET";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      message: this.message,
      name: this.name,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
