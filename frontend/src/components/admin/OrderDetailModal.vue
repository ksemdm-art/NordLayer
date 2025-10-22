<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="$emit('close')"
          >
            <span class="sr-only">Закрыть</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="sm:flex sm:items-start">
          <div class="w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
              Заказ #{{ order?.id }}
            </h3>

            <div class="space-y-6">
              <!-- Order Status -->
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-gray-900">Статус заказа</h4>
                    <span
                      class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(order?.status)"
                    >
                      {{ getStatusText(order?.status) }}
                    </span>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Создан</p>
                    <p class="text-sm font-medium text-gray-900">{{ formatDate(order?.created_at) }}</p>
                  </div>
                </div>
              </div>

              <!-- Customer Information -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Информация о клиенте</h4>
                <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Имя</label>
                      <p class="mt-1 text-sm text-gray-900">{{ order?.customer_name }}</p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <p class="mt-1 text-sm text-gray-900">{{ order?.customer_email || order?.customer_contact }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div v-if="order?.customer_phone">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Телефон</label>
                      <p class="mt-1 text-sm text-gray-900">{{ order?.customer_phone }}</p>
                    </div>
                    <div v-if="order?.alternative_contact">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Альтернативная связь</label>
                      <p class="mt-1 text-sm text-blue-600">{{ order?.alternative_contact }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Service Information -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Информация об услугах</h4>
                <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                  <!-- Основная услуга -->
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Основная услуга</label>
                      <p class="mt-1 text-sm text-gray-900">{{ order?.service_name || 'Не указана' }}</p>
                      <p class="text-xs text-gray-500">ID: {{ order?.service_id }}</p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Общая стоимость</label>
                      <p class="mt-1 text-sm text-gray-900">
                        <span v-if="order?.total_price && order.total_price > 0">
                          {{ formatPrice(order.total_price) }}₽
                          <span v-if="order?.multi_color" class="text-xs text-orange-600 ml-1">(+50% за многоцветность)</span>
                        </span>
                        <span v-else class="text-gray-500 italic">Цена не указана</span>
                      </p>
                    </div>
                  </div>



                  <!-- Список всех услуг из specifications -->
                  <div v-if="order && Array.isArray(order.specifications?.services) && (order.specifications as any).services.length > 0" class="pt-3 border-t border-gray-200">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Все выбранные услуги</label>
                    <div class="space-y-2">
                      <div
                        v-for="(service, index) in (order && Array.isArray(order.specifications?.services) ? (order.specifications as any).services : [])"
                        :key="index"
                        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900">{{ (service as any)?.name || (service as any)?.service_name || `Услуга ${index + 1}` }}</p>
                          <p class="text-xs text-gray-500">
                            ID: {{ (service as any)?.id || (service as any)?.service_id }}
                            <span v-if="(service as any)?.description" class="block mt-1">{{ (service as any)?.description }}</span>
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-sm font-medium text-gray-900">
                            {{ formatPrice(getServicePriceById(service)) }}₽
                          </p>

                          <p class="text-xs text-gray-500" v-if="(service as any)?.price_factors && Object.keys((service as any).price_factors).length > 0">
                            С учетом факторов
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Альтернативные способы отображения услуг -->
                  <div v-else-if="order && Array.isArray(order.specifications?.selectedServices) && (order.specifications as any).selectedServices.length > 0" class="pt-3 border-t border-gray-200">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Выбранные услуги</label>
                    <div class="space-y-2">
                      <div
                        v-for="(service, index) in (order && Array.isArray(order.specifications?.selectedServices) ? (order.specifications as any).selectedServices : [])"
                        :key="index"
                        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900">{{ (service as any)?.name || `Услуга ${index + 1}` }}</p>
                          <p class="text-xs text-gray-500">ID: {{ (service as any)?.id }}</p>
                        </div>
                        <div class="text-right">
                          <p class="text-sm font-medium text-gray-900">{{ formatPrice(getServicePriceById(service)) }}₽</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Проверяем другие возможные поля для услуг -->
                  <div v-else-if="order && ((Array.isArray(order.specifications?.servicesList) && (order.specifications as any).servicesList.length > 0) || (Array.isArray(order.specifications?.orderServices) && (order.specifications as any).orderServices.length > 0) || (Array.isArray(order.specifications?.additionalServices) && (order.specifications as any).additionalServices.length > 0))" class="pt-3 border-t border-gray-200">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Дополнительные услуги</label>
                    <div class="space-y-2">
                      <div
                        v-for="(service, index) in (order && order.specifications ? (order.specifications.servicesList || order.specifications.orderServices || order.specifications.additionalServices) : [])"
                        :key="index"
                        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900">{{ (service as any)?.name || (service as any)?.service_name || (service as any)?.title || `Услуга ${index + 1}` }}</p>
                          <p class="text-xs text-gray-500">
                            <span v-if="(service as any)?.id || (service as any)?.service_id">ID: {{ (service as any)?.id || (service as any)?.service_id }}</span>
                            <span v-if="(service as any)?.description" class="block mt-1">{{ (service as any)?.description }}</span>
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-sm font-medium text-gray-900">{{ formatPrice(getServicePriceById(service)) }}₽</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Если услуги хранятся как объект, а не массив -->
                  <div v-else-if="typeof order?.specifications?.services === 'object' && order?.specifications?.services" class="pt-3 border-t border-gray-200">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Услуги (объект)</label>
                    <div class="space-y-2">
                      <div
                        v-for="(service, key) in order.specifications.services"
                        :key="key"
                        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900">{{ (service as any)?.name || (service as any)?.service_name || key }}</p>
                          <p class="text-xs text-gray-500">
                            <span v-if="(service as any)?.id">ID: {{ (service as any)?.id }}</span>
                            <span v-if="(service as any)?.description" class="block mt-1">{{ (service as any)?.description }}</span>
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-sm font-medium text-gray-900">{{ formatPrice(getServicePriceById(service)) }}₽</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Print Parameters -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Параметры печати</h4>
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div v-if="order?.quantity">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Количество</label>
                      <p class="mt-1 text-sm text-gray-900">{{ order.quantity }} шт.</p>
                    </div>
                    <div v-if="order?.material">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Материал</label>
                      <p class="mt-1 text-sm text-gray-900">{{ order.material }}</p>
                    </div>
                    <div v-if="order?.quality">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Качество</label>
                      <p class="mt-1 text-sm text-gray-900">{{ order.quality }}</p>
                    </div>
                    <div v-if="order?.infill">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Заполнение</label>
                      <p class="mt-1 text-sm text-gray-900">{{ order.infill }}%</p>
                    </div>
                    <div v-if="order?.urgency">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Срочность</label>
                      <p class="mt-1 text-sm text-gray-900">{{ order.urgency }}</p>
                    </div>
                  </div>
                  
                  <!-- Colors -->
                  <div class="mt-3 pt-3 border-t border-gray-200">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Цвета</label>
                    

                    
                    <!-- Multi-color case -->
                    <div v-if="order?.multi_color && order?.multi_colors?.length" class="space-y-2">
                      <div
                        v-for="(colorInfo, index) in order.multi_colors"
                        :key="index"
                        class="flex items-center space-x-2"
                      >
                        <div
                          class="w-4 h-4 rounded border border-gray-300"
                          :style="{ backgroundColor: getColorValue(colorInfo) }"
                        ></div>
                        <span class="text-sm text-gray-900">{{ getColorName(colorInfo, index) }}</span>
                      </div>
                    </div>
                    
                    <!-- Single color case -->
                    <div v-else-if="order?.color_name || order?.color" class="flex items-center space-x-2">
                      <div
                        class="w-4 h-4 rounded border border-gray-300"
                        :style="{ backgroundColor: getColorValue(order.color) }"
                      ></div>
                      <span class="text-sm text-gray-900">{{ order.color_name || getColorName(order.color, 0) }}</span>
                    </div>
                    
                    <!-- Fallback: check specifications directly -->
                    <div v-else-if="order?.specifications?.color || order?.specifications?.selectedColor" class="flex items-center space-x-2">
                      <div
                        class="w-4 h-4 rounded border border-gray-300"
                        :style="{ backgroundColor: getColorValue(order.specifications.selectedColor || order.specifications.color) }"
                      ></div>
                      <span class="text-sm text-gray-900">
                        {{ getColorName(order.specifications.selectedColor || order.specifications.color, 0) }}
                      </span>
                    </div>
                    
                    <!-- No color info -->
                    <div v-else class="text-sm text-gray-500 italic">
                      Информация о цвете не указана
                    </div>
                  </div>
                </div>
              </div>

              <!-- Delivery Information -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Информация о доставке</h4>
                <div class="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Получение заказа</label>
                      <p class="mt-1 text-sm text-gray-900">
                        <span v-if="order?.delivery_needed === 'true'" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          🚚 С доставкой
                        </span>
                        <span v-else-if="order?.delivery_needed === 'false'" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          🏪 Самовывоз
                        </span>
                        <span v-else-if="order?.delivery_method" class="text-gray-900">
                          {{ getDeliveryMethodText(order.delivery_method) }}
                        </span>
                        <span v-else class="text-gray-500 italic">Не указано</span>
                      </p>
                    </div>
                    <div v-if="order?.payment_method">
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Способ оплаты</label>
                      <p class="mt-1 text-sm text-gray-900">{{ getPaymentMethodText(order.payment_method) }}</p>
                    </div>
                  </div>
                  
                  <!-- Delivery Details -->
                  <div v-if="order?.delivery_details" class="pt-3 border-t border-gray-200">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Детали доставки</label>
                    <div class="mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p class="text-sm text-blue-900">{{ order.delivery_details }}</p>
                    </div>
                  </div>
                  
                  <!-- Legacy delivery fields -->
                  <div v-if="order?.delivery_address" class="pt-3 border-t border-gray-200">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Адрес доставки (устаревшее)</label>
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-400 uppercase tracking-wide">Адрес</label>
                        <p class="mt-1 text-sm text-gray-700">{{ order.delivery_address }}</p>
                      </div>
                      <div v-if="order?.delivery_city">
                        <label class="block text-xs font-medium text-gray-400 uppercase tracking-wide">Город</label>
                        <p class="mt-1 text-sm text-gray-700">{{ order.delivery_city }}</p>
                      </div>
                      <div v-if="order?.delivery_postal_code">
                        <label class="block text-xs font-medium text-gray-400 uppercase tracking-wide">Индекс</label>
                        <p class="mt-1 text-sm text-gray-700">{{ order.delivery_postal_code }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Details -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Детали заказа</h4>
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Описание</label>
                    <p class="mt-1 text-sm text-gray-900">{{ order?.notes || 'Нет описания' }}</p>
                  </div>
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Источник</label>
                      <span
                        class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getSourceClass(order?.source)"
                      >
                        {{ getSourceText(order?.source) }}
                      </span>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide">Обновлен</label>
                      <p class="mt-1 text-sm text-gray-900">{{ formatDate(order?.updated_at) }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Gallery Items -->
              <div v-if="order?.selected_gallery_items?.length">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Выбранные модели из галереи</h4>
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <div class="space-y-3">
                    <div
                      v-for="item in order.selected_gallery_items"
                      :key="item.id"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div class="flex items-center space-x-3">
                        <img
                          v-if="item.image_url"
                          :src="item.image_url"
                          :alt="item.title"
                          class="w-12 h-12 object-cover rounded"
                        />
                        <div class="flex-shrink-0" v-else>
                          <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</p>
                          <p class="text-xs text-gray-500">
                            Проект из галереи • ID: {{ item.id }}
                            <span v-if="item.stl_file" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-1">
                              STL доступен
                            </span>
                            <span v-if="item.description" class="block truncate mt-1">{{ item.description }}</span>
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          @click="downloadGalleryProject(item)"
                          :disabled="!item.stl_file"
                          :class="[
                            'inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded',
                            item.stl_file 
                              ? 'text-green-700 bg-green-100 hover:bg-green-200' 
                              : 'text-gray-500 bg-gray-100 cursor-not-allowed'
                          ]"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {{ item.stl_file ? 'STL файл' : 'STL недоступен' }}
                        </button>
                        <button
                          @click="viewGalleryProject(item)"
                          class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Просмотр
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Files (if any) -->
              <div v-if="(order?.files && order.files.length > 0) || (order?.files_info && order.files_info.length > 0)">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Прикрепленные файлы</h4>
                <div class="bg-white border border-gray-200 rounded-lg p-4">
                  <div class="space-y-3">
                    <!-- Files from order.files -->
                    <div
                      v-for="file in order?.files || []"
                      :key="file.id"
                      class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ file.original_filename }}</p>
                          <p class="text-xs text-gray-500">
                            {{ getFileExtension(file.original_filename) }} файл
                            <span v-if="file.file_size"> • {{ formatFileSize(file.file_size) }}</span>
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          @click="downloadFile(file)"
                          class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Скачать
                        </button>
                        <a
                          :href="file.file_path"
                          target="_blank"
                          class="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Открыть
                        </a>
                      </div>
                    </div>

                    <!-- Files from order.files_info -->
                    <div
                      v-for="(fileInfo, index) in order?.files_info || []"
                      :key="`info-${index}`"
                      class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div class="flex items-center space-x-3">
                        <div class="flex-shrink-0">
                          <svg class="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ fileInfo.name || `Файл ${index + 1}` }}</p>
                          <p class="text-xs text-gray-600">
                            {{ getFileExtension(fileInfo.name) }} файл
                            <span v-if="fileInfo.size"> • {{ formatFileSize(fileInfo.size) }}</span>
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center space-x-2">
                        <button
                          @click="downloadFileInfo(fileInfo)"
                          class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Скачать
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Закрыть
                </button>
                <button
                  type="button"
                  @click="openStatusModal"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Изменить статус
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { api } from '@/services/api'
import { useColors } from '@/composables/useColors'
import { useServices } from '@/composables/useServices'
import type { Order } from '@/types'

interface Props {
  order: Order | null
}

interface Emits {
  (e: 'close'): void
  (e: 'updated', order: Order): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Используем композабл для работы с цветами
const { loadColors, getColorValue: getServerColorValue, getColorName: getServerColorName } = useColors()

// Используем композабл для работы с услугами
const { loadServices, getServicePrice } = useServices()

const getStatusClass = (status: string | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  
  const classes = {
    'new': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string | undefined) => {
  if (!status) return 'Неизвестно'
  
  const texts = {
    'new': 'Новый',
    'in_progress': 'В работе',
    'completed': 'Завершен',
    'cancelled': 'Отменен'
  }
  return texts[status as keyof typeof texts] || status
}

const getSourceClass = (source: string | undefined) => {
  if (!source) return 'bg-gray-100 text-gray-800'
  
  const classes = {
    'web': 'bg-purple-100 text-purple-800',
    'telegram': 'bg-blue-100 text-blue-800'
  }
  return classes[source as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getSourceText = (source: string | undefined) => {
  if (!source) return 'Неизвестно'
  
  const texts = {
    'web': 'Сайт',
    'telegram': 'Telegram'
  }
  return texts[source as keyof typeof texts] || source
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Неизвестно'
  
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number | null | undefined) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '0'
  }
  return new Intl.NumberFormat('ru-RU').format(Math.round(price))
}

const getDeliveryMethodText = (method: string | undefined) => {
  if (!method) return 'Не указан'
  
  const methods = {
    'pickup': 'Самовывоз',
    'delivery': 'Доставка',
    'courier': 'Курьер'
  }
  return methods[method as keyof typeof methods] || method
}

const getPaymentMethodText = (method: string | undefined) => {
  if (!method) return 'Не указан'
  
  const methods = {
    'cash': 'Наличные',
    'card': 'Банковская карта',
    'transfer': 'Банковский перевод',
    'online': 'Онлайн оплата'
  }
  return methods[method as keyof typeof methods] || method
}

const getFileExtension = (filename: string | undefined) => {
  if (!filename) return 'Неизвестный'
  const ext = filename.split('.').pop()?.toUpperCase()
  return ext || 'Неизвестный'
}

const formatFileSize = (bytes: number | undefined) => {
  if (!bytes) return 'Неизвестный размер'
  
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const getColorValue = (colorInfo: unknown): string => {
  // Если это число (ID цвета), получаем с сервера
  if (typeof colorInfo === 'number') {
    const serverColor = getServerColorValue(colorInfo)
    // Fallback карта цветов если сервер не отвечает
    if (serverColor === '#cccccc') {
      const fallbackColors: Record<number, string> = {
        1: '#FF0000', 2: '#00FF00', 3: '#0000FF', 4: '#FFFF00',
        5: '#FF00FF', 6: '#00FFFF', 7: '#FFA500', 8: '#800080',
        9: '#FFC0CB', 10: '#000000', 11: '#FFFFFF', 12: '#808080'
      }
      return fallbackColors[colorInfo] || '#cccccc'
    }
    return serverColor
  }
  
  if (typeof colorInfo === 'string') {
    // Если это строка с числом (ID цвета)
    if (/^\d+$/.test(colorInfo)) {
      return getColorValue(parseInt(colorInfo))
    }
    
    // Если это hex цвет
    if (colorInfo.startsWith('#')) return colorInfo
    
    // Если это название цвета, оставляем как есть
    return colorInfo
  }
  
  // Если это объект с цветом
  if ((colorInfo as any)?.color) return (colorInfo as any).color
  if ((colorInfo as any)?.value) return (colorInfo as any).value
  if ((colorInfo as any)?.hex) return (colorInfo as any).hex
  
  return '#cccccc'
}

const getColorName = (colorInfo: unknown, index: number): string => {
  // Если это число (ID цвета), получаем название с сервера
  if (typeof colorInfo === 'number') {
    const serverName = getServerColorName(colorInfo)
    // Fallback карта названий если сервер не отвечает
    if (serverName === `Цвет #${colorInfo}`) {
      const fallbackNames: Record<number, string> = {
        1: 'Красный', 2: 'Зеленый', 3: 'Синий', 4: 'Желтый',
        5: 'Пурпурный', 6: 'Голубой', 7: 'Оранжевый', 8: 'Фиолетовый',
        9: 'Розовый', 10: 'Черный', 11: 'Белый', 12: 'Серый'
      }
      return fallbackNames[colorInfo] || `Цвет #${colorInfo}`
    }
    return serverName
  }
  
  if (typeof colorInfo === 'string') {
    // Если это строка с числом (ID цвета)
    if (/^\d+$/.test(colorInfo)) {
      return getColorName(parseInt(colorInfo), index)
    }
    
    // Если это название цвета, вернем как есть
    return colorInfo
  }
  
  // Если это объект с названием
  return (colorInfo as any)?.name || (colorInfo as any)?.label || (colorInfo as any)?.title || `Цвет ${index + 1}`
}

const getServicePriceById = (serviceInfo: any) => {
  // Если есть готовая цена, используем её (преобразуем в число)
  if (serviceInfo?.price || serviceInfo?.base_price || serviceInfo?.cost) {
    const price = serviceInfo.price || serviceInfo.base_price || serviceInfo.cost
    return typeof price === 'string' ? parseFloat(price) : price
  }
  
  // Если есть только ID, получаем цену с сервера
  let serverPrice = 0
  if (typeof serviceInfo === 'number') {
    serverPrice = getServicePrice(serviceInfo)
  } else if (serviceInfo?.id) {
    serverPrice = getServicePrice(serviceInfo.id)
  }
  
  // Fallback цены если сервер не отвечает
  if (serverPrice === 0) {
    const fallbackPrices: Record<number, number> = {
      1: 50,   // FDM Печать
      2: 100,  // SLA Печать  
      3: 150,  // Постобработка
      4: 200   // 3D Моделирование
    }
    const serviceId = typeof serviceInfo === 'number' ? serviceInfo : serviceInfo?.id
    return fallbackPrices[serviceId] || 0
  }
  
  return serverPrice
}

const downloadFile = async (file: any) => {
  try {
    const response = await fetch(file.file_path)
    const blob = await response.blob()
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = file.original_filename || 'file'
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
    alert('Ошибка при скачивании файла')
  }
}

const downloadFileInfo = async (fileInfo: any) => {
  try {
    // Попробуем разные варианты URL файла
    const fileUrl = fileInfo.url || fileInfo.path || fileInfo.file_path
    
    if (!fileUrl) {
      // Если нет прямой ссылки, попробуем через API
      if (props.order?.id && fileInfo.id) {
        const apiUrl = `/orders/${props.order.id}/files/${fileInfo.id}/download`
        const link = document.createElement('a')
        link.href = apiUrl
        link.download = fileInfo.name || fileInfo.filename || 'file'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return
      }
      
      alert('Файл недоступен для скачивания')
      return
    }
    
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const blob = await response.blob()
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileInfo.name || fileInfo.filename || 'file'
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
    alert('Ошибка при скачивании файла. Попробуйте позже.')
  }
}

const downloadGalleryProject = async (item: any) => {
  try {
    // Сначала получим полную информацию о проекте из галереи
    const response = await api.get(`/gallery/${item.id}`)
    const project = response.data.data || response.data
    
    if (project.stl_file) {
      // Если есть STL файл, скачиваем его
      const fileResponse = await fetch(project.stl_file)
      if (!fileResponse.ok) {
        throw new Error(`HTTP error! status: ${fileResponse.status}`)
      }
      
      const blob = await fileResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${project.title || item.title}.stl`
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } else {
      alert('STL файл для этого проекта не найден')
    }
  } catch (error) {
    console.error('Error downloading gallery project:', error)
    alert('Ошибка при скачивании STL файла проекта')
  }
}

const viewGalleryProject = (item: any) => {
  // Открываем проект в новой вкладке
  const projectUrl = `/gallery/${item.id}`
  window.open(projectUrl, '_blank')
}

const openStatusModal = () => {
  // This will be handled by parent component
  emit('close')
  // Parent will open status modal
}

// Загружаем цвета и услуги при монтировании компонента
onMounted(() => {
  loadColors()
  loadServices()
})
</script>