class PaymentProcessor {
  isWebhook() {}
  getWebhookData() {}
  getWebhookMeta(data) {
    return {
      webhookEventId: this.getWebhookIdentifier(data),
    };
  }
  mapPaymentStatus() {}
  validate() {}
  authenticate() {}
  checkEvent(eventData, data) {
    return eventData.webhookEventId === this.getWebhookIdentifier(data);
  }
  getWebhookIdentifier() {}

  async create() {}
  async cancel() {}
}

export default PaymentProcessor;
