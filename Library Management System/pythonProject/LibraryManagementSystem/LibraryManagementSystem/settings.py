DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'LMS',
        'USER': 'root',
        'PASSWORD': 'Abhi4444*',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'loans',
    'corsheaders',
    'rest_framework',
    'users',

    'books',
    'reservations',
]


ALLOWED_HOSTS = ['localhost', '127.0.0.1']
ROOT_URLCONF = 'LibraryManagementSystem.urls'
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
]
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
]
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']

SECRET_KEY = 'hyl5-hg*0-$12ba062qp2e0*qnu%^w$h@xcb)sk2_u!k(ciz!%'
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}


AUTHENTICATION_BACKENDS = ['users.backends.EmailBackend',    'django.contrib.auth.backends.ModelBackend',
]
AUTH_USER_MODEL = 'users.User'
