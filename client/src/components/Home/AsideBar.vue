<template>
    <div class="col-md-4 col-lg-3 col-sm-12 mt-3">
        <div class="card">
            <CarouselAsideBar />
            <div class="card-header">
                <h4 class="fw-semibold d-flex justify-content-between align-items-center" v-if="authenticated">
                    <span>
                        مرحبـــــاً بك
                        د/
                        {{ user.object.first_name }}
                        <n-popover trigger="hover" v-if="user.object.isActive">
                            <template #trigger>
                                <n-badge dot processing type="success"
                                    style="margin: -10px 5px 0 0">
                                    <n-avatar />
                                </n-badge>
                            </template>
                            <span>
                                الحساب مُفعل
                            </span>
                        </n-popover>
                        <n-popover trigger="hover" v-if="authenticated && user.object.isActive == false">
                            <template #trigger>
                                <n-badge dot processing
                                    style="margin: -10px 5px 0 0">
                                    <n-avatar />
                                </n-badge>
                            </template>
                            <span>
                                الحساب غير مُفعل
                            </span>
                        </n-popover>
                    </span>

                    <div class="btn-group">
                        <button class="dropdown-toggle border-0 bg-transparent" type="button" id="triggerId"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <n-icon size="20">
                                <EllipsisVerticalOutline />
                            </n-icon>
                        </button>
                        <div class="dropdown-menu dropdown-menu-start" aria-labelledby="triggerId">
                            <a class="dropdown-item" href="#" type="button" data-bs-toggle="modal"
                                data-bs-target="#LibInfo">
                                معلومات عـن المكتبة
                            </a>
                            <n-divider class="my-1" />
                            <a class="dropdown-item" href="#" type="button" data-bs-toggle="modal"
                                data-bs-target="#compliants">
                                للشكاوى والمقتراحات
                            </a>
                            <n-divider class="my-1" />
                            <a class="dropdown-item" href="#" type="button" data-bs-toggle="modal"
                                data-bs-target="#Useable">
                                شـــــروط الإستخـــدام
                            </a>
                        </div>
                    </div>

                    <div class="modal fade" id="LibInfo" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
                        role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalTitleId">
                                        معلومات عن المكتبة
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <n-list hoverable bordered clickable>
                                        <n-list-item>
                                            <p class="m-0" style="line-height: 25px">
                                                تعتبر المكتبة منصة تعليمية متخصصة تهدف إلى تسهيل عملية الوصول إلى المعلومات
                                                الأكاديمية عبر توفير محتوى تعليمي ذو جودة عالية. تضم المكتبة فريقًا من
                                                الدكاترة ذوي الخبرة العالية في مختلف المجالات الأكاديمية.

                                                يتميز كل دكتور بملفات PDF خاصة به، تحتوي على محتوى متخصص يشمل المحاضرات
                                                والمعلومات الأكاديمية الهامة. يمكن للطلاب الاستفادة من هذه الملفات كمصدر قيم
                                                للدراسة والاستعداد للامتحانات.

                                                تقوم المكتبة بتوفير آليات لشراء الملفات الرقمية، مما يجعل الطلاب قادرين على
                                                الوصول إلى المحتوى بسهولة وفعالية. وتهدف المكتبة إلى حماية حقوق الملكية
                                                الفكرية ومنع أي استخدام غير مصرح به، مثل السرقة الأكاديمية أو تصوير الشاشة.

                                                بهذه الطريقة، توفر المكتبة بيئة تعلم آمنة ومحترفة للطلاب والدارسين، تعزز
                                                تبادل المعرفة وتعزيز جودة التعليم الأكاديمي
                                            </p>
                                        </n-list-item>
                                    </n-list>
                                </div>
                                <div class="modal-footer d-flex">
                                    <n-button type="primary" class="m-auto" data-bs-dismiss="modal">
                                        إغلاق
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="Useable" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
                        role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalTitleId">
                                        شروط الإستخدام
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <n-list hoverable bordered clickable>
                                        <n-list-item>
                                            <n-thing title="شراء الملف:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يُشترط على المستخدم شراء الملف قبل أن يحصل على حقوق ملكيته واستخدامه بشكل
                                                كامل. يتيح ذلك للمستخدم الوصول الكامل إلى المحتوى والاستفادة منه بموجب
                                                الشروط المحددة.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="استخدام شخصي فقط:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                <template #description>
                                                    <n-space size="small" style="margin-top: 4px">
                                                        <n-tag :bordered="false" type="error" size="small">
                                                            هام جداً
                                                        </n-tag>
                                                    </n-space>
                                                </template>
                                                يجب أن يتم استخدام الملفات المشتراة للاستخدام الشخصي فقط، ولا يُسمح بتوزيعها
                                                أو بيعها لأطراف ثالثة دون إذن كتابي.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="حقوق الملكية الفكرية:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يتعين على المستخدم احترام حقوق الملكية الفكرية للملف، ويُمنع نسخ المحتوى أو
                                                استخدامه في إطار يتعارض مع هذه الحقوق.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="عدم التعديل دون إذن:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يُحظر تعديل الملفات دون الحصول على إذن صريح. يمكن للمستخدم إجراء تعديلات فقط
                                                بعد الحصول على موافقة كتابية.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="ضمان محدود:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يُقدم الملف "كما هو"، ولا يوجد أي ضمان صريح أو ضمان ضمني بخصوص دقة أو أداء
                                                الملف.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="مسؤولية محدودة:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                لا تتحمل المكتبة أو المُبيع للملف أية مسؤولية عن أية خسائر أو أضرار ناتجة عن
                                                استخدام الملف.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="تحديثات ودعم فني:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يُفضل للمستخدم الرجوع إلى سياسة التحديثات والدعم الفني، والالتزام بالتحديثات
                                                اللاحقة للملفات لضمان الأمان والأداء الأمثل.
                                            </n-thing>
                                        </n-list-item>
                                    </n-list>
                                </div>
                                <div class="modal-footer d-flex">
                                    <n-button type="primary" class="m-auto" data-bs-dismiss="modal">
                                        إغلاق
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal fade" id="compliants" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false"
                        role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalTitleId">
                                        شروط الإستخدام
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <n-list hoverable bordered clickable>
                                        <n-list-item>
                                            <n-thing title="شراء الملف:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يُشترط على المستخدم شراء الملف قبل أن يحصل على حقوق ملكيته واستخدامه بشكل
                                                كامل. يتيح ذلك للمستخدم الوصول الكامل إلى المحتوى والاستفادة منه بموجب
                                                الشروط المحددة.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="استخدام شخصي فقط:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                <template #description>
                                                    <n-space size="small" style="margin-top: 4px">
                                                        <n-tag :bordered="false" type="error" size="small">
                                                            هام جداً
                                                        </n-tag>
                                                    </n-space>
                                                </template>
                                                يجب أن يتم استخدام الملفات المشتراة للاستخدام الشخصي فقط، ولا يُسمح بتوزيعها
                                                أو بيعها لأطراف ثالثة دون إذن كتابي.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="حقوق الملكية الفكرية:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يتعين على المستخدم احترام حقوق الملكية الفكرية للملف، ويُمنع نسخ المحتوى أو
                                                استخدامه في إطار يتعارض مع هذه الحقوق.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="عدم التعديل دون إذن:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يُحظر تعديل الملفات دون الحصول على إذن صريح. يمكن للمستخدم إجراء تعديلات فقط
                                                بعد الحصول على موافقة كتابية.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="ضمان محدود:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يُقدم الملف "كما هو"، ولا يوجد أي ضمان صريح أو ضمان ضمني بخصوص دقة أو أداء
                                                الملف.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="مسؤولية محدودة:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                لا تتحمل المكتبة أو المُبيع للملف أية مسؤولية عن أية خسائر أو أضرار ناتجة عن
                                                استخدام الملف.
                                            </n-thing>
                                        </n-list-item>
                                        <n-list-item>
                                            <n-thing title="تحديثات ودعم فني:"
                                                content-style="margin-top: 10px; line-height: 25px">
                                                يُفضل للمستخدم الرجوع إلى سياسة التحديثات والدعم الفني، والالتزام بالتحديثات
                                                اللاحقة للملفات لضمان الأمان والأداء الأمثل.
                                            </n-thing>
                                        </n-list-item>
                                    </n-list>
                                </div>
                                <div class="modal-footer d-flex">
                                    <n-button type="primary" class="m-auto" data-bs-dismiss="modal">
                                        إغلاق
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <n-modal v-model:show="showModal">
                        <n-card style="width: 600px" title="الإشعارات" :bordered="false" size="huge" role="dialog"
                            :mask-closable="false" :esc-closable="false" aria-modal="true">
                            <template #header-extra>
                                <n-button text @click="showModal = false">
                                    <n-icon>
                                        <Close />
                                    </n-icon>
                                </n-button>
                            </template>
                            <p class="text-center d-flex flex-column justify-content-center m-auto gap-2">
                                <n-icon size="40" class="text-center m-auto">
                                    <NotificationsOffOutline />
                                </n-icon>
                                لا يوجد إشعارات جديدة
                            </p>
                        </n-card>
                    </n-modal>
                </h4>
                <h4 class="fw-medium" v-else>
                    <RouterLink to="/login">
                        <n-button type="primary" dashed block class="w-100">
                            تسجيل الدخول
                        </n-button>
                    </RouterLink>
                </h4>
            </div>
            <div class="card-body">
                <n-collapse arrow-placement="right" accordion>
                    <n-collapse-item title="معلومات الحساب" name="1">
                        <n-list hoverable bordered clickable show-divider>
                            <n-list-item
                                v-if="user.object && user.object.wallet && user.object.wallet.balance.$numberDecimal">
                                <n-thing
                                    :title="user.object.wallet.balance.$numberDecimal ? 'الرصيد' + ' : ' + user.object.wallet.balance.$numberDecimal + ' جنية' : '0 جنية'">
                                </n-thing>
                            </n-list-item>
                        </n-list>
                        <n-list hoverable bordered clickable show-divider>
                            <n-list-item>
                                <n-thing
                                    :title="'الإسم' + ' : ' + user.object.first_name + ' ' + user.object.last_name"></n-thing>
                            </n-list-item>
                        </n-list>
                        <n-list hoverable bordered clickable show-divider>
                            <n-list-item>
                                <n-thing :title="user.object.semester == 1 ? 'الترم' + ' : ' + 'الأول' : user.object.semester == 2 ? 'الترم' + ' : ' + 'الثانى'
                                    : user.object.semester == 3 ? 'الترم' + ' : ' + 'الثالث' : user.object.semester == 4 ? 'الترم' + ' : ' + 'الرابع' : user.object.semester == 5 ? 'الترم' + ' : ' + 'الخامس'
                                        : user.object.semester == 6 ? 'الترم' + ' : ' + 'السادس' : user.object.semester == 7 ? 'الترم' + ' : ' + 'السابع' : user.object.semester == 8 ? 'الترم' + ' : ' + 'الثامن'
                                            : 'الترم' + ' : ' + user.object.object.semester
                                    "></n-thing>
                            </n-list-item>
                        </n-list>
                        <n-list hoverable bordered clickable show-divider>
                            <n-list-item>
                                <n-thing
                                    :title="'رقم الهاتف' + ' : ' + user.object.phone.split('').slice(1, 12).join('')"></n-thing>
                            </n-list-item>
                        </n-list>
                        <n-list hoverable bordered clickable show-divider>
                            <n-list-item>
                                <n-thing :title="'تاريخ الإنضمام' + ' : ' + new Date(user.object.createdAt).toLocaleDateString('ar-EG', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })">
                                </n-thing>
                            </n-list-item>
                        </n-list>
                    </n-collapse-item>

                    <n-collapse-item title="المعاملات المالية" name="2">
                        <div class="d-flex gap-1 justify-content-center row">
                            <n-button type="primary" icon-only class="rounded" data-bs-toggle="modal"
                                data-bs-target="#PayMoney">
                                <n-icon size="20">
                                    <SwapHorizontal />
                                </n-icon>
                                <span class="px-1">
                                    شحن الرصيد
                                </span>
                            </n-button>
                            <n-button type="primary" dashed class="rounded" data-bs-toggle="modal"
                                data-bs-target="#ShowTransactions">
                                <n-icon size="20">
                                    <Wallet />
                                </n-icon>
                                <span class="px-1">
                                    العمليات المالية
                                </span>
                            </n-button>
                        </div>
                    </n-collapse-item>

                    <!-- ShowTransactions Modal -->
                    <div class="modal fade" id="ShowTransactions" tabindex="-1" role="dialog" aria-labelledby="modalTitleId"
                        aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalTitleId">
                                        العمليات المالية
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body overflow-auto">
                                    <div>
                                        <table
                                            class="table table-striped table-hover bg-white table-bordered text-center w-100 text-nowrap rounded mb-0">
                                            <tr class="bg-success text-light">
                                                <th class="p-2">
                                                    #
                                                </th>
                                                <th class="p-2">
                                                    الإسم
                                                </th>
                                                <th class="p-2">المبلغ</th>
                                                <th class="p-2">العملية</th>
                                                <th class="p-2">الطريقة</th>
                                                <th class="p-2">التاريخ</th>
                                            </tr>
                                            <tr v-if="isLoadingWallet">
                                                <td colspan="6" class="py-2">
                                                    <n-button :loading="isLoadingWallet" text type="primary"></n-button>
                                                </td>
                                            </tr>
                                            <tr v-else-if="wallet.length === 0">
                                                <td colspan="6" class="py-5 fs-3 fw-medium">
                                                    لا توجد عمليات مالية
                                                </td>
                                            </tr>
                                            <tr v-for="(transaction, index) in wallet" :key="transaction._id" v-else>
                                                <td class="p-2">
                                                    <span>
                                                        {{ index + 1 }}
                                                    </span>
                                                </td>
                                                <td class="p-2">
                                                    <span>
                                                        {{ transaction.transaction._id }}
                                                    </span>
                                                </td>
                                                <td class="p-2">
                                                    <span
                                                        v-if="transaction.transaction && transaction.transaction.amount && transaction.transaction.amount.$numberDecimal">
                                                        {{ transaction.transaction.amount.$numberDecimal }} جنية
                                                    </span>
                                                </td>
                                                <td class="p-2">
                                                    <n-tag :bordered="false" size="small"
                                                        :type="transaction.transaction.operationType == 'withdraw' ? 'success' : 'error'">
                                                        {{ transaction.transaction.operationType == 'withdraw' ? 'سحب' :
                                                            'إيداع'
                                                        }}
                                                    </n-tag>
                                                </td>
                                                <td class="p-2">
                                                    {{ transaction.transaction.deposedThrough ?
                                                        transaction.transaction.deposedThrough : '-' }}
                                                </td>
                                                <td class="p-2">
                                                    {{ transaction.date }}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div class="modal-footer d-flex">
                                    <n-button type="primary" class="m-auto" data-bs-dismiss="modal">
                                        إغــلاق
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- PayMoney Modal -->
                    <div class="modal fade" id="PayMoney" tabindex="-1" role="dialog" aria-labelledby="modalTitleId"
                        aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title d-flex justify-content-between w-100" id="modalTitleId">
                                        <span>
                                            شحن الرصيد
                                        </span>
                                        <span>
                                            <n-tag :bordered="false" type="success" size="small"
                                                v-if="authenticated && user.object.wallet.balance.$numberDecimal">
                                                {{ 'الرصيد الحالى : ' + user.object.wallet.balance.$numberDecimal + ' جنية'
                                                }}
                                            </n-tag>
                                        </span>
                                    </h5>
                                </div>
                                <div class="modal-body">
                                    <n-tabs type="bar" animated justify-content="center">
                                        <n-tab-pane name="فودافون كاش">
                                            <!-- INFORMATION WITH LINK OF FORM -->
                                            <n-thing title="طريقة شحن الرصيد ( 3 خطوات)"
                                                content-style="margin: 10px 10px 20px 0px;">
                                                <p class="mt-2">
                                                    دفع المبلغ ودا متاح عن طريق
                                                </p>
                                                <p class="alert alert-success text-center rounded-0 p-2">
                                                    رقم المحفظة: 01029142392
                                                </p>
                                                <p>
                                                    وبعدها بتبعت البيانات الآتية عبر تليجرام على
                                                </p>
                                                <p>
                                                    <a href="https://t.me/Fasila_Library" class="text-success text-center">
                                                        https://t.me/Fasila_Library
                                                    </a>
                                                </p>
                                                <p>
                                                    لتأكيد الدفع لازم تبعت البيانات دى كاملة:
                                                </p>
                                                <p>
                                                    ١- سكرين شوت من رسالة التحويل (او صورة الايصال لو التحويل من ماكينة مثل
                                                    فوري وأمان ….)
                                                </p>
                                                <p>
                                                    ٢- الرقم اللي تم التحويل منه (ضروري جدا)
                                                </p>
                                                <p>
                                                    ٣- وقت التحويل
                                                </p>
                                                <p>
                                                    ٤- الاسم كامل باللغة العربية (نفس الاسم فى الاكونت والفورم)
                                                </p>
                                                <p>
                                                    ٥- الجامعة والسنة الدراسية (الفرقة)
                                                    واللى مش هيبعت البيانات دى كاملة مش هنعتبر ده تأكيد للدفع
                                                </p>
                                                <p>
                                                    عمل اكونت على المكتبة ( على جهاز واحد فقط اللي هتستخدمه طول الدراسة)
                                                </p>
                                                <p>
                                                    مجرد تعمل sign up ببياناتك بس وانتظر التفعيل في خلال ٢٤ ساعة بحد اقصى من
                                                    اجراءات الاشتراك وتسجيل الفورم وهتلاقيه في "مكتبتي"
                                                </p>
                                                <p>
                                                    ولو قابلك مشكلة في المكتبة تواصل معانا عن طريق بوت التليجرام فى صفحة
                                                    المكتبة أو
                                                </p>
                                                <p>
                                                    <a href="https://t.me/Complain_fasilabot"
                                                        class="text-success text-center">
                                                        https://t.me/Complain_fasilabot
                                                    </a>
                                                </p>
                                            </n-thing>
                                        </n-tab-pane>
                                        <n-tab-pane name="انستا بي">
                                            <!-- INFORMATION WITH LINK OF FORM -->
                                            <n-thing title="طريقة شحن الرصيد ( 3 خطوات)"
                                                content-style="margin-top: 10px; padding-right: 10px">
                                                <p class="mt-2">
                                                    دفع المبلغ ودا متاح عن طريق
                                                </p>
                                                <p class="alert alert-success text-center rounded-0 p-2">
                                                    01116715792 ( instapay )
                                                </p>
                                                <p>
                                                    وبعدها بتبعت البيانات الآتية عبر تليجرام على
                                                </p>
                                                <p>
                                                    <a href="https://t.me/Fasila_Library" class="text-success text-center">
                                                        https://t.me/Fasila_Library
                                                    </a>
                                                </p>
                                                <p>
                                                    لتأكيد الدفع لازم تبعت البيانات دى كاملة:
                                                </p>
                                                <p>
                                                    ١- سكرين شوت من رسالة التحويل (او صورة الايصال لو التحويل من ماكينة مثل
                                                    فوري وأمان ….)
                                                </p>
                                                <p>
                                                    ٢- الرقم اللي تم التحويل منه (ضروري جدا)
                                                </p>
                                                <p>
                                                    ٣- وقت التحويل
                                                </p>
                                                <p>
                                                    ٤- الاسم كامل باللغة العربية (نفس الاسم فى الاكونت والفورم)
                                                </p>
                                                <p>
                                                    ٥- الجامعة والسنة الدراسية (الفرقة)
                                                    واللى مش هيبعت البيانات دى كاملة مش هنعتبر ده تأكيد للدفع
                                                </p>
                                                <p>
                                                    عمل اكونت على المكتبة ( على جهاز واحد فقط اللي هتستخدمه طول الدراسة)
                                                </p>
                                                <p>
                                                    مجرد تعمل sign up ببياناتك بس وانتظر التفعيل في خلال ٢٤ ساعة بحد اقصى من
                                                    اجراءات الاشتراك وتسجيل الفورم وهتلاقيه في "مكتبتي"
                                                </p>
                                                <p>
                                                    ولو قابلك مشكلة في المكتبة تواصل معانا عن طريق بوت التليجرام فى صفحة
                                                    المكتبة أو
                                                </p>
                                                <p>
                                                    <a href="https://t.me/Complain_fasilabot"
                                                        class="text-success text-center">
                                                        https://t.me/Complain_fasilabot
                                                    </a>
                                                </p>
                                            </n-thing>
                                        </n-tab-pane>
                                    </n-tabs>
                                </div>
                                <div class="modal-footer d-flex">
                                    <n-button type="primary" class="m-auto" data-bs-dismiss="modal">
                                        إغــلاق
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <n-collapse-item :title="'مكتبتى' + ' ' + '(' + mySubjects.length + ')'" name="3">
                        <n-list hoverable clickable bordered>
                            <n-list-item v-if="loadingMySubject && mySubjects.length === 0">
                                <n-button text type="primary" loading class="d-flex m-auto"></n-button>
                            </n-list-item>
                            <n-list-item v-else-if="mySubjects.length === 0" class="text-center">
                                لا يوجد مواد دراسية
                            </n-list-item>
                            <n-list-item v-else v-for="subject in mySubjects" :key="subject.id">
                                <n-thing>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="d-flex align-items-center gap-2">
                                            <img :src="subject.photo" :alt="subject.name" class="img-fluid rounded-circle"
                                                style="width: 40px; height: 40px; object-fit: cover;" />
                                            <p class="m-0">
                                                {{ subject.name }}
                                            </p>
                                        </div>
                                        <n-button type="primary" circle data-bs-toggle="modal" data-bs-target="#myLib"
                                            @click="GetMySubjectModal(subject)">
                                            <n-icon size="20">
                                                <EyeOutline />
                                            </n-icon>
                                        </n-button>
                                    </div>
                                </n-thing>
                            </n-list-item>
                        </n-list>
                    </n-collapse-item>

                    <!-- myLib Modal -->
                    <div class="modal fade" id="myLib" tabindex="-1" role="dialog" aria-labelledby="modalTitleId"
                        aria-hidden="true">
                        <div class="modal-dialog modal-lg" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title d-flex align-items-center gap-1" id="modalTitleId">
                                        <img :src="subjectDetails.photo" :alt="subjectDetails.name"
                                            class="img-fluid rounded-circle"
                                            style="width: 40px; height: 40px; object-fit: cover;"
                                            v-if="subjectDetails.photo" />
                                        <img src="../../assets/images/Book.jpg" :alt="subjectDetails.name"
                                            class="img-fluid rounded-circle"
                                            style="width: 40px; height: 40px; object-fit: cover;" v-else />
                                        {{ subjectDetails.name }}
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div class="overflow-auto">
                                        <table
                                            class="table table-striped table-hover bg-white table-bordered text-center w-100 text-nowrap rounded mb-0">
                                            <tr class="bg-success text-light">
                                                <th class="p-2">
                                                    #
                                                </th>
                                                <th class="p-2">
                                                    الإسم
                                                </th>
                                                <th class="p-2">
                                                    الصورة
                                                </th>
                                                <th class="p-2">
                                                    عدد الأوراق
                                                </th>
                                                <th class="p-2">
                                                    عدد المشتريات
                                                </th>
                                                <th class="p-2">تاريخ الشراء</th>
                                                <th class="p-2"
                                                    v-if="authenticated && user.object.isActive"
                                                >ابدأ</th>
                                            </tr>
                                            <tr v-if="loadingMyLectures">
                                                <td colspan="8" class="py-2">
                                                    <n-button :loading="loadingMyLectures" text type="primary"></n-button>
                                                </td>
                                            </tr>
                                            <tr v-else-if="myLectures.length === 0">
                                                <td colspan="5" class="py-5 fs-3 fw-medium">
                                                    لا يوجد محاضرات
                                                </td>
                                            </tr>
                                            <tr v-for="(lecture, index) in myLectures" :key="lecture.id" v-else>
                                                <td class="p-2">
                                                    <span>
                                                        {{ index + 1 }}
                                                    </span>
                                                </td>
                                                <td class="p-2">
                                                    <span>
                                                        {{ lecture.name }}
                                                    </span>
                                                </td>
                                                <td class="p-2">
                                                    <img :src="lecture.preview_path" :alt="lecture.name"
                                                        class="rounded-circle border p-0"
                                                        style="width: 50px; height: 50px; object-fit: cover;"
                                                        v-if="lecture.preview_path" />
                                                    <img src="../../assets/images/Book.jpg" :alt="lecture.name"
                                                        class="rounded-circle border p-0"
                                                        style="width: 50px; height: 50px; object-fit: cover;" v-else />
                                                </td>
                                                <td class="p-2">
                                                    <span>
                                                        {{ lecture.no_slides }}
                                                    </span>
                                                </td>
                                                <td class="p-2">
                                                    <span>
                                                        {{ lecture.no_purchases }}
                                                    </span>
                                                </td>
                                                <td class="p-2">
                                                    <span>
                                                        {{ new Date(lecture.createdAt).toLocaleDateString('ar-EG', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) }}
                                                    </span>
                                                </td>
                                                <td class="p-2" v-if="authenticated && user.object.isActive">
                                                    <n-button tertiary circle @click="StartLecture(lecture._id)" type="primary">
                                                        <template #icon>
                                                            <n-icon size="20">
                                                                <PlayOutline />
                                                            </n-icon>
                                                        </template>
                                                    </n-button>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                <div class="modal-footer d-flex">
                                    <n-button type="primary" class="m-auto" data-bs-dismiss="modal">
                                        إغــلاق
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <n-collapse-item :title="'المفضلــة' + ' ' + '(' + favoriteDr.length + ')'" name="4">
                        <n-list hoverable clickable bordered>
                            <n-list-item v-for="dr in favoriteDr" :key="dr.id">
                                {{ dr.name }}
                                <n-button type="error" text size="small" class="float-end" icon-only
                                    @click="DisHeartDr(dr)">
                                    <n-icon size="20">
                                        <HeartDislike />
                                    </n-icon>
                                </n-button>
                            </n-list-item>
                            <!-- رؤية المزيد -->
                            <n-button type="primary" text size="small" class="d-flex m-auto my-2 align-items-center gap-1"
                                data-bs-toggle="modal" data-bs-target="#showFavoriteDr" icon-only
                                v-if="favoriteDr.length > 5">
                                <n-icon size="20">
                                    <EyeOutline />
                                </n-icon>
                                <span class="mx-1">
                                    عرض الكل
                                </span>
                            </n-button>
                            <n-list-item v-if="$store.state.favoriteDr.loader && favoriteDr.length === 0">
                                <n-button text type="primary" loading class="d-flex m-auto"></n-button>
                            </n-list-item>
                            <n-list-item v-if="!$store.state.favoriteDr.loader && favoriteDr.length === 0"
                                class="text-center">
                                لا يوجد دكاترة مفضلين
                            </n-list-item>
                        </n-list>
                    </n-collapse-item>

                    <!-- showFavoriteDr Modal -->
                    <div class="modal fade" id="showFavoriteDr" tabindex="-1" role="dialog" aria-labelledby="modalTitleId"
                        aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="modalTitleId">
                                        الدكاترة المفضلين
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <n-list hoverable clickable bordered>
                                        <n-list-item v-for="dr in favoriteDr" :key="dr.id">
                                            {{ dr.name }}
                                            <n-button type="error" text size="small" class="float-end" icon-only
                                                @click="DisHeartDrModal(dr)">
                                                <n-icon size="20">
                                                    <HeartDislike />
                                                </n-icon>
                                            </n-button>
                                        </n-list-item>
                                        <n-list-item v-if="$store.state.favoriteDr.loader && favoriteDr.length === 0">
                                            <n-button text type="primary" loading class="d-flex m-auto"></n-button>
                                        </n-list-item>
                                        <n-list-item v-if="!$store.state.favoriteDr.loader && favoriteDr.length === 0"
                                            class="text-center">
                                            لا يوجد دكاترة مفضلين
                                        </n-list-item>
                                    </n-list>
                                </div>
                                <div class="modal-footer d-flex">
                                    <n-button type="primary" class="m-auto" data-bs-dismiss="modal">
                                        إغــلاق
                                    </n-button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <n-collapse-item title="تسجيل الخروج" name="5">
                        <template #arrow>
                            <n-icon size="20">
                                <ExitOutline />
                            </n-icon>
                        </template>
                        <n-p>
                            هل تريد تسجيل الخروج من الحساب ؟
                            <a href="#" @click.prevent="signOut">
                                <n-button type="primary" dashed block class="w-100 m-1">
                                    تسجيل الخروج
                                </n-button>
                            </a>
                        </n-p>
                    </n-collapse-item>

                    <n-collapse-item title="حذف الحساب" name="6" v-if="authenticated && user.object.isActive">
                        <template #arrow>
                            <n-icon size="20">
                                <TrashOutline />
                            </n-icon>
                        </template>
                        <n-p>
                            هل متأكد من حذف الحساب ؟
                            <RouterLink to="" @click="deleteAccount">
                                <n-button type="error" dashed block class="w-100 m-1">
                                    حذف الحساب
                                </n-button>
                            </RouterLink>
                        </n-p>
                    </n-collapse-item>
                </n-collapse>
            </div>
        </div>
        <ShortcutIntro />
    </div>
</template>

<script>
import {
    NCollapse, NCollapseItem, NList, NListItem, NThing, NSpace, NTag, NButton, NModal, NCard, NIcon, NP, NTabs, NTabPane, NDivider, NBadge, NPopover
} from 'naive-ui';
import CarouselAsideBar from './CarouselAsideBar.vue';
import {
    Close, NotificationsOffOutline, ExitOutline,
    TrashOutline,
    EllipsisVerticalOutline,
    EyeOutline, SwapHorizontal, Wallet, PlayOutline, HeartDislike, NAvatar
} from "@vicons/ionicons5";
import { mapActions, mapGetters } from 'vuex';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import bootstrapBundleMin from 'bootstrap/dist/js/bootstrap.bundle.min';
import ShortcutIntro from '../ShortcutIntro.vue';

export default {
    name: 'AsideBar',
    components: {
        NCollapse,
        NCollapseItem,
        NList,
        NListItem,
        NThing,
        NSpace,
        NTag,
        CarouselAsideBar,
        NButton,
        NModal,
        NCard,
        NIcon,
        Close,
        NotificationsOffOutline,
        ExitOutline,
        TrashOutline,
        NP,
        EllipsisVerticalOutline,
        EyeOutline,
        SwapHorizontal,
        Wallet,
        NTabs,
        NTabPane,
        NDivider,
        PlayOutline,
        HeartDislike,
        ShortcutIntro,
        NBadge,
        NAvatar,
        NPopover
    },
    data() {
        return {
            showModal: false,
            loadingFavoriteDr: false,
            wallet: [],
            isLoadingWallet: true,
            price: '',
            mySubjects: [],
            loadingMySubject: true,
            subjectDetails: {},
            myLectures: [],
            loadingMyLectures: true,
            isLoadingMyData: true
        }
    },
    computed: {
        ...mapGetters({
            authenticated: 'auth/authenticated',
            user: 'auth/user',
            favoriteDr: 'getFavoriteDr'
        })
    },
    mounted() {
        this.$store.dispatch('getFavoriteDr');
        this.$store.state.favoriteDr.loader = this.loadingFavoriteDr;
        this.getWallet();
        this.getMySubject();
    },
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut'
        }),
        signOut() {
            this.signOutAction().then(() => {
                useToast().success('تم تسجيل الخروج بنجاح');
                this.$router.push('/login');
            });
        },
        async DisHeartDr(id) {
            await axios.delete(`/doctors/${id._id}/Student/favorites`)
                .then(response => {
                    if (response.status == 200) {
                        // this.getFavoriteDr();
                        this.$store.dispatch('getFavoriteDr');
                        this.$store.state.favoriteDr.loader = this.loadingFavoriteDr;
                        useToast().success(`تم إزالة الدكتور ${id.name} من المفضلة بنجاح`);
                    }
                })
                .catch(() => {
                    useToast().error(`حدث خطأ أثناء إزالة الدكتور ${id.name} من المفضلة`);
                })
        },
        async DisHeartDrModal(id) {
            await axios.delete(`/doctors/${id._id}/Student/favorites`)
                .then(response => {
                    if (response.status == 200) {
                        // this.getFavoriteDr();
                        this.$store.dispatch('getFavoriteDr');
                        this.$store.state.favoriteDr.loader = this.loadingFavoriteDr;
                        useToast().success(`تم إزالة الدكتور ${id.name} من المفضلة بنجاح`);
                        // Hide Modal showFavoriteDr
                        const modal = document.getElementById('showFavoriteDr');
                        const modalInstance = bootstrapBundleMin.Modal.getInstance(modal);
                        modalInstance.hide();
                    }
                })
                .catch(() => {
                    useToast().error(`حدث خطأ أثناء إزالة الدكتور ${id.name} من المفضلة`);
                })
        },
        async getWallet() {
            await axios.get('/students/wallet')
                .then(response => {
                    if (response.status == 200) {
                        this.isLoadingWallet = false;
                        this.wallet = response.data.data;
                    }
                })
                .catch(() => {
                    useToast().error('حدث خطأ أثناء تحميل الرصيد');
                })
        },
        async getMySubject() {
            await axios.get('/Subjects/My')
                .then(response => {
                    if (response.status == 200) {
                        this.mySubjects = response.data.PurchasedSubjects;
                        this.loadingMySubject = false;
                    }
                })
        },
        GetMySubjectModal(subject) {
            this.subjectDetails = subject;
            this.getLectureBySubjectId(subject._id);
        },
        async getLectureBySubjectId(id) {
            await axios.get(`/Subjects/${id}/Lectures/My`)
                .then(response => {
                    if (response.status == 200) {
                        this.loadingMyLectures = false;
                        this.myLectures = response.data.data;
                    }
                })
        },
        async StartLecture(cardId) {
            await axios.get(`/PLectures/${cardId}`)
                .then(response => {
                    if (response.status == 200) {
                        this.$router.push({
                            path: `/pdf/${cardId}`,
                            query: { pdfLink: response.data.data.path, password: btoa(response.data.data.password) }
                        });
                    }
                })
            // Hide Modal
            const modal = document.getElementById('myLib');
            const modalInstance = bootstrapBundleMin.Modal.getInstance(modal);
            modalInstance.hide();
        },
        async deleteAccount() {
            await axios.delete('/students')
                .then(response => {
                    if (response.status == 200) {
                        // Account will Be Suspended After 3 Days
                        useToast().success('سيتم حذف الحساب خلال 3 أيام');
                    }
                })
                .catch(() => {
                    useToast().error('حدث خطأ أثناء حذف الحساب');
                })
        }
    },
    setup() {
        return {
            onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
        }
    }

}
</script>

<style scoped>
@import url('@/assets/css/custom.css');

.overflow-auto::-webkit-scrollbar {
    height: .2rem;
}

.overflow-auto::-webkit-scrollbar-track {
    background: #eee;
}

.overflow-auto::-webkit-scrollbar-thumb {
    background: #bdbdbd;
}
</style>