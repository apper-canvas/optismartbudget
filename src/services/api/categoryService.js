import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class CategoryService {
  constructor() {
    this.apperClient = null
  }

  getClient() {
    if (!this.apperClient) {
      this.apperClient = getApperClient()
    }
    return this.apperClient
  }

  async getAll() {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.fetchRecords('categories_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.getRecordById('categories_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error)
      throw error
    }
  }

  async getByType(type) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.fetchRecords('categories_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}}
        ],
        where: [{
          "FieldName": "type_c",
          "Operator": "EqualTo",
          "Values": [type],
          "Include": true
        }]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error(`Error fetching categories by type ${type}:`, error)
      throw error
    }
  }
}

export const categoryService = new CategoryService()