export class Character {
  constructor() {
    this.character_id = ''
    this.created_at = ''
    this.updated_at = ''
    this.loki_character_id = ''
    this.detail = {
      model: 'gpt-3.5-turbo',
      description: '',
      language: 'English',
      setting: '',
      sample_conversations: ''
    }
    this.loki_detail = {
      name: '',
      description: ''
    }
    this.user_detail = {}
    this.system_prompt = ''
    this.is_deleted = false
    this.is_active = false
    this.name = ''
  }
}

export class Account {
  constructor() {
    this.account_id = ''
    this.created_at = ''
    this.updated_at = ''
    this.status = 'staged'
    this.email = ''
    this.password = ''
    this.role = 'editor'
    this.username = ''
  }
}

export class Message {
  constructor(frozen) {
    this.loki_character_id = ''
    this.content = ''
    this.is_frozen = false
    this.role = ''
    this.embedding = null
    if (frozen) {
      this.is_frozen = true
      this.role = 'assistant'
    }
  }
}

export class Model {
  constructor() {
    this.model_id = ''
    this.created_at = ''
    this.updated_at = ''
    this.name = ''
    this.description = ''
    this.language = 'English'
  }
}

export class FineTune {
  constructor() {
    this.base_model = ''
    this.training_file = null
    this.validation_data = null
    this.model_name = ''
    this.epoch = ''
  }
}